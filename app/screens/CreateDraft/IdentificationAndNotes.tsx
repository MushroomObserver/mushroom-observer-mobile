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
  const [
    postObservation, // This is the mutation trigger
    postObservationResult, // This is the destructured mutation result
  ] = usePostObservationMutation();
  const [postImage, postImageResult] = usePostImageMutation();
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);

  console.log(draftImages);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Save"
          onPress={() => {
            const observation = omitBy(draftObservation, isEmpty);
            postObservation({ ...observation, api_key: apiKey });
          }}
        />
      ),
    });
  }, [navigation, postObservation]);

  useEffect(() => {
    if (postObservationResult.isSuccess) {
      removeDraftObservation(id);
      const newObservation = postObservationResult.data.results[0];
      // forEach(draftImages)
      // postImage({
      //   copyright_holder: draft
      //   date: date (when photo taken)
      //   license: license
      //   notes: string
      //   observations: observation list (must have edit permission)
      //   original_name: string (limit=120 chars, original file name or other private identifier)
      //   projects: project list (must be member)
      //   upload: upload
      //   upload_file: string
      //   upload_url: string
      //   vote: enum (limit=1|2|3|4)
      // });
      addObservation(newObservation);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }

    if (postObservationResult.isError) {
      // updateDraftObservation({ id, changes: { vote, notes } });
      console.log(postObservationResult.error.data);
      // setShowToast(true);
      // setErrorMessage(error);
    }
  });

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
