import { selectKey } from '../../store/auth';
import { selectAll, selectByDraftObservationId } from '../../store/draftImages';
import {
  selectById,
  updateDraftObservation as updateDraftObservationAction,
  removeDraftObservation as removeDraftObservationAction,
} from '../../store/draftObservations';
import {
  usePostImageMutation,
  usePostObservationMutation,
} from '../../store/mushroomObserver';
import { addObservation as addObservationAction } from '../../store/observations';
import { ForwardedIdentificationAndNotesProps } from '../../types/navigation';
import { useNavigation } from '@react-navigation/core';
import { filter, forEach, isEmpty, omitBy } from 'lodash';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Button, ScrollView } from 'react-native';
import {
  Colors,
  Picker,
  Text,
  Toast,
  TextField,
  View,
  LoaderScreen,
} from 'react-native-ui-lib';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';
import { connect, ConnectedProps } from 'react-redux';

interface IdentificationAndNotesProps extends PropsFromRedux {
  id: string;
}

const IdentificationAndNotes = ({
  id,
  apiKey,
  draftObservation,
  draftImages,
  updateDraftObservation,
  removeDraftObservation,
  addObservation,
}: IdentificationAndNotesProps) => {
  const navigation = useNavigation();

  const [vote, setVote] = useState(draftObservation?.vote);
  const [notes, setNotes] = useState(draftObservation?.notes);
  const [postObservation, postObservationResult] = usePostObservationMutation();
  const [postImage, postImageResult] = usePostImageMutation();
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Save"
          onPress={() => {
            let observation = omitBy(
              { notes, vote, ...draftObservation },
              isEmpty,
            );
            delete observation.id;
            delete observation.draftPhotoIds;
            if (!postObservationResult.isLoading) {
              postObservation({
                ...observation,
                api_key: apiKey,
                detail: 'high',
              });
            }
          }}
        />
      ),
    });
  }, [navigation, postObservation]);

  useEffect(() => {
    if (postObservationResult.isSuccess) {
      console.log('result', postObservationResult);
      const newObservation = postObservationResult.data.results[0];

      async function uploadImages() {
        try {
          const imagesToUpload = filter(draftImages, draftImage => {
            return draftImage.draftObservationId != id;
          });
          let promises = imagesToUpload.map(image =>
            postImage({
              key: apiKey,
              // copyright_holder: image.copyrightHolder,
              // date: image.date,
              // license: image.license.value,
              // notes: image.notes,
              observations: newObservation.id,
              original_name: image.fileName,
              uri: image.uri,
              name: image.fileName,
              type: image.type,
              detail: 'high',
            }).unwrap(),
          );
          let results = await Promise.all(promises);
          console.log('results', results);

          addObservation(newObservation);
          removeDraftObservation(id);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } catch (e) {
          console.log('e', e);
        }
      }

      uploadImages();
    }

    if (postObservationResult.isError) {
      updateDraftObservation({ id, changes: { vote, notes } });
      console.log('error', postObservationResult);
      // setShowToast(true);
      // setErrorMessage(error);
    }
  }, [postObservationResult]);

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View flex padding-20>
          <Picker title="Confidence" onChange={setVote} value={vote}>
            <Picker.Item value={3.0} label="I'd Call It That" />
            <Picker.Item value={2.0} label="Promising" />
            <Picker.Item value={1.0} label="Could Be" />
            <Picker.Item value={-1.0} label="Doubtful" />
            <Picker.Item value={-2.0} label="Not Likely" />
            <Picker.Item value={-3.0} label="As If!" />
          </Picker>
          <TextField
            title="Notes"
            value={notes}
            onChangeText={setNotes}
            expandable
            multiline
          />
          <Text>
            Please include any additional information you can think of about
            this observation that isn’t clear from the photographs, e.g.,
            habitat, substrate or nearby trees; distinctive texture, scent,
            taste, staining or bruising; results of chemical or microscopic
            analyses, etc.
          </Text>
        </View>
      </ScrollView>
      <Toast
        backgroundColor={Colors.red30}
        position="top"
        visible={showToast}
        message={errorMessage}
        // autoDismiss={3000}
        showDismiss
        onDismiss={() => setShowToast(false)}
      />
      {postObservationResult.isLoading && (
        <LoaderScreen
          color={Colors.blue30}
          backgroundColor={Colors.grey50}
          message="Loading..."
          overlay
        />
      )}
    </View>
  );
};

const mapStateToProps = (state: any, ownProps: any) => ({
  apiKey: selectKey(state),
  draftObservation: selectById(state, ownProps.id),
  draftImages: selectAll(state),
});

const mapDispatchToProps = {
  updateDraftObservation: updateDraftObservationAction,
  removeDraftObservation: removeDraftObservationAction,
  addObservation: addObservationAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConnectedIdentificationAndNotes = connector(IdentificationAndNotes);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default withForwardedNavigationParams<ForwardedIdentificationAndNotesProps>()(
  ConnectedIdentificationAndNotes,
);
