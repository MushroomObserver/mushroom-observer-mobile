import { ConfidencePicker } from '../../../components/ConfidencePicker';
import { NotesField } from '../../../components/NotesField';
import { selectKey } from '../../../store/auth';
import {
  selectAll,
  removeDraftImage as removeDraftImageAction,
  removeDraftImage,
} from '../../../store/draftImages';
import {
  selectById,
  updateDraftObservation as updateDraftObservationAction,
  removeDraftObservation as removeDraftObservationAction,
} from '../../../store/draftObservations';
import {
  setError as setErrorAction,
  setWarning as setWarningAction,
  setInfo as setInfoAction,
} from '../../../store/flash';
import { addImage, addImage as addImageAction } from '../../../store/images';
import {
  usePostImageMutation,
  usePostObservationMutation,
} from '../../../store/mushroomObserver';
import { addObservation as addObservationAction } from '../../../store/observations';
import { ForwardedIdentificationAndNotesProps } from '../../../types/navigation';
import { NetInfoState, useNetInfo } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/core';
import { filter, get, isUndefined, omitBy } from 'lodash';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Button, ScrollView } from 'react-native';
import { Colors, View, LoaderScreen } from 'react-native-ui-lib';
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
  addImage,
  removeDraftImage,
  setError,
  setWarning,
  setInfo,
}: IdentificationAndNotesProps) => {
  const netinfo: NetInfoState = useNetInfo();
  console.log(netinfo);
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [vote, setVote] = useState(draftObservation?.vote);
  const [notes, setNotes] = useState(draftObservation?.notes);
  const [postObservation, postObservationResult] = usePostObservationMutation();
  const [postImage, postImageResult] = usePostImageMutation();

  const SaveObservationButton = () => {
    const { isConnected, isInternetReachable }: NetInfoState = useNetInfo();

    return (
      <Button
        title="Save"
        disabled={isLoading}
        onPress={() => {
          let observation = omitBy(
            { notes, vote, ...draftObservation },
            isUndefined,
          );
          delete observation.id;
          delete observation.draftPhotoIds;
          if (isConnected && isInternetReachable) {
            setIsLoading(true);
            postObservation({
              notes,
              vote,
              ...observation,
              api_key: apiKey,
              detail: 'high',
            })
              .then(postObservationResponse => {
                const newObservation = get(
                  postObservationResponse,
                  'data.results[0]',
                );
                if (newObservation) {
                  // uploadImages(id, newObservation.id);
                  setInfo('Observation created');
                  addObservation(newObservation);
                  removeDraftObservation(id);
                  const imagesToUpload = filter(draftImages, [
                    'draftObservationId',
                    id,
                  ]);
                  if (imagesToUpload) {
                    return Promise.all(
                      imagesToUpload.map(image =>
                        postImage({
                          key: apiKey,
                          copyright_holder: image?.copyrightHolder,
                          date: image?.date,
                          license: image?.license?.value,
                          notes: image?.notes,
                          observations: newObservation.id,
                          original_name: image.fileName,
                          uri: image.uri,
                          name: image.fileName,
                          type: image.type,
                          detail: 'high',
                        })
                          .then(imageUploadResponse => {
                            const newImage = get(
                              imageUploadResponse,
                              'data.results[0]',
                            );
                            if (newImage) {
                              addImage(newImage);
                              removeDraftImage(image.id);
                            }
                            const error = get(
                              imageUploadResponse,
                              'error.data.errors[0].details',
                            );
                            if (error) {
                              setError(error);
                            }
                            console.log('image uploaded', newImage);
                          })
                          .catch(e => console.log('image upload failed', e)),
                      ),
                    )
                      .then(results => {
                        console.log('results', results);
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'Home' }],
                        });
                      })
                      .catch(e => console.log(e));
                  } else {
                  }
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                  });
                }
                const error = get(
                  postObservationResponse,
                  'error.data.errors[0].details',
                );
                console.log('new observation', newObservation);
                console.log('error', error);
                if (error) {
                  setError(error);
                }
                setIsLoading(false);
              })
              .catch(e => console.log('create failed', e));
          } else {
            setWarning('Draft saved');
            updateDraftObservation({ id, changes: { vote, notes } });
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          }
        }}
      />
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <SaveObservationButton />,
    });
  }, [navigation, postObservation, notes, vote]);

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View flex padding-20>
          <ConfidencePicker
            confidence={vote}
            onChangeConfidence={({ value }) => setVote(value)}
          />
          <NotesField notes={notes} onChangeNotes={setNotes} />
        </View>
      </ScrollView>

      {isLoading && (
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

const mapStateToProps = (state: any, ownProps: any) => {
  const draftImages = selectAll(state);
  console.log('ownProps.id', ownProps.id);
  console.log(
    'draftImages',
    filter(draftImages, ['draftObservationId', ownProps.id]),
  );
  return {
    apiKey: selectKey(state),
    draftObservation: selectById(state, ownProps.id),
    draftImages,
    // draftImages: filter(selectAll(state), ['draftObservationId', ownProps.id]),
  };
};

const mapDispatchToProps = {
  updateDraftObservation: updateDraftObservationAction,
  removeDraftObservation: removeDraftObservationAction,
  addObservation: addObservationAction,
  removeDraftImage: removeDraftImageAction,
  addImage: addImageAction,
  setError: setErrorAction,
  setWarning: setWarningAction,
  setInfo: setInfoAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConnectedIdentificationAndNotes = connector(IdentificationAndNotes);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default withForwardedNavigationParams<ForwardedIdentificationAndNotesProps>()(
  ConnectedIdentificationAndNotes,
);
