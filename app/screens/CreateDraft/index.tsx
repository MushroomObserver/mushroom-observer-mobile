import AddPhotosButton from '../../components/AddPhotosButton';
import { ConfidencePicker } from '../../components/ConfidencePicker';
import LocationPicker from '../../components/LocationPicker';
import NamePicker from '../../components/NamePicker';
import { NotesField } from '../../components/NotesField';
import HeaderButtons from '../../components/header/HeaderButtons';
import OverflowMenu from '../../components/header/OverflowMenu';
import { useKey } from '../../hooks/useAuth';
import useDayjs from '../../hooks/useDayjs';
import {
  addDraftImages as addDraftImagesAction,
  removeDraftImage as removeDraftImageAction,
  selectAll,
} from '../../store/draftImages';
import {
  removeDraftObservation as removeDraftObservationAction,
  selectById,
  updateDraftObservation as updateDraftObservationAction,
} from '../../store/draftObservations';
import {
  setError as setErrorAction,
  setInfo as setInfoAction,
  setWarning as setWarningAction,
} from '../../store/flash';
import { addImage as addImageAction } from '../../store/images';
import {
  usePostImageMutation,
  usePostObservationMutation,
} from '../../store/mushroomObserver';
import {
  addObservation as addObservationAction,
  updateObservation as updateObservationAction,
} from '../../store/observations';
import { ForwardedCreateDraftProps } from '../../types/navigation';
import PhotoCarousel from './PhotoCarousel';
import { useNavigation } from '@react-navigation/native';
import { nanoid } from '@reduxjs/toolkit';
import { clamp, get, omitBy, isUndefined, filter, concat } from 'lodash';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Callback, ImagePickerResponse } from 'react-native-image-picker';
import {
  Wizard,
  View,
  Button,
  Text,
  Switch,
  TextField,
  DateTimePicker,
  LoaderScreen,
  Colors,
} from 'react-native-ui-lib';
import { HiddenItem, Item } from 'react-navigation-header-buttons';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';
import { connect, ConnectedProps } from 'react-redux';

interface DraftWizardProps extends PropsFromRedux {
  id: string;
}

const DraftWizard = ({
  id,
  draftObservation,
  draftImages,
  updateDraftObservation,
  removeDraftObservation,
  addObservation,
  updateObservation,
  addImage,
  addDraftImages,
  removeDraftImage,
  setInfo,
  setWarning,
  setError,
}: DraftWizardProps) => {
  const navigation = useNavigation();

  const [activeIndex, setActiveIndex] = useState(0);

  const back = () => setActiveIndex(clamp(activeIndex - 1, 0, 2));
  const next = () => setActiveIndex(clamp(activeIndex + 1, 0, 2));

  const dayjs = useDayjs();
  const apiKey = useKey();

  const [draftPhotoIds, setDraftPhotoIds] = useState(
    draftObservation?.draftPhotoIds || [],
  );
  const [name, setName] = useState(draftObservation?.name);
  const [date, setDate] = useState(dayjs(draftObservation?.date).toDate());
  const [location, setLocation] = useState(draftObservation?.location);
  const [isCollectionLocation, setIsCollectionLocation] = useState(
    draftObservation?.isCollectionLocation || true,
  );
  const [gpsHidden, setGpsHidden] = useState(
    draftObservation?.gpsHidden || false,
  );
  const [vote, setVote] = useState(draftObservation?.vote);
  const [notes, setNotes] = useState(draftObservation?.notes);

  const [postObservation, postObservationResult] = usePostObservationMutation();
  const [postImage, postImageResult] = usePostImageMutation();

  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons>
          <Item
            title="Discard"
            onPress={() =>
              Alert.alert(
                'Discard Observation',
                'Do you want to discard this observation?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Discard',
                    onPress: () => {
                      removeDraftObservation(id);
                      navigation.navigate('Home', {
                        screen: 'My Drafts',
                      });
                    },
                  },
                ],
              )
            }
          />
        </HeaderButtons>
      ),
      headerRight: () => (
        <HeaderButtons>
          <Item
            title="Save"
            onPress={() => {
              updateDraftObservation({
                id,
                changes: {
                  name,
                  date: dayjs(date).format('YYYYMMDD'),
                  location,
                  isCollectionLocation,
                  gpsHidden,
                  vote,
                  notes,
                  draftPhotoIds,
                },
              });
              navigation.navigate('Home', {
                screen: 'My Drafts',
              });
            }}
          />
          <OverflowMenu>
            <HiddenItem
              title="Upload"
              disabled={!location}
              onPress={() => {
                let observation = omitBy(
                  { notes, vote, ...draftObservation },
                  isUndefined,
                );
                setIsLoading(true);
                postObservation({
                  api_key: apiKey,
                  name,
                  date: dayjs(date).format('YYYYMMDD'),
                  location,
                  isCollectionLocation,
                  gpsHidden,
                  vote,
                  notes,
                  detail: 'high',
                })
                  .then(postObservationResponse => {
                    const newObservation = get(
                      postObservationResponse,
                      'data.results[0]',
                    );
                    if (newObservation) {
                      setInfo('Observation created');
                      addObservation(newObservation);
                      removeDraftObservation(id);
                      const imagesToUpload = filter(draftImages, ({ id }) =>
                        draftPhotoIds.includes(id),
                      );
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
                                  setInfo('Image uploaded');
                                  addImage(newImage);
                                  removeDraftImage(image.id);
                                  return newImage.id;
                                }
                                const error = get(
                                  imageUploadResponse,
                                  'error.data.errors[0].details',
                                );
                                if (error) {
                                  setError(error);
                                }
                              })
                              .catch(e =>
                                console.log('image upload failed', e),
                              ),
                          ),
                        )
                          .then(results => {
                            updateObservation({
                              id: newObservation.id,
                              changes: {
                                photoIds: results,
                              },
                            });
                            navigation.reset({
                              index: 0,
                              routes: [{ name: 'Home' }],
                            });
                          })
                          .catch(e => console.log('failed', e));
                      } else {
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'Home' }],
                        });
                      }
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
              }}
            />
          </OverflowMenu>
        </HeaderButtons>
      ),
    });
  }, [
    navigation,
    name,
    date,
    location,
    isCollectionLocation,
    gpsHidden,
    vote,
    notes,
    draftPhotoIds,
  ]);

  const addPhotos: Callback = async ({
    didCancel,
    assets,
  }: ImagePickerResponse) => {
    if (!didCancel && assets) {
      const newIds: string[] = [];
      console.log(assets);
      let date = undefined;
      const draftImages = assets.map(asset => {
        const newId = nanoid();
        newIds.push(newId);
        setDate(dayjs(asset.timestamp).toDate());
        return {
          ...asset,
          id: newId,
          draftObservationId: id,
          date: dayjs(asset.timestamp).format('YYYYMMDD'),
        };
      });
      addDraftImages(draftImages);
      setDraftPhotoIds(concat(draftPhotoIds, newIds));
      updateDraftObservation({ id, changes: { name, draftPhotoIds, date } });
    }
  };

  const removePhoto = (photoId: string) => {
    setDraftPhotoIds(filter(draftPhotoIds, draftId => draftId != photoId));
    removeDraftImage(photoId);
    updateDraftObservation({ id, changes: { name, draftPhotoIds } });
  };

  const SELECTION_LIMIT = 12;

  const NOTES_DETAILS =
    'Please include any additional information you can think of about this ' +
    'observation that isn’t clear from the photographs, e.g., habitat, ' +
    'substrate or nearby trees; distinctive texture, scent, taste, staining ' +
    'or bruising; results of chemical or microscopic analyses, etc.';

  return (
    <View flex>
      <Wizard activeIndex={activeIndex} onActiveIndexChanged={setActiveIndex}>
        <Wizard.Step state={Wizard.States.ENABLED} label="Photos and Name" />
        <Wizard.Step
          state={location ? Wizard.States.ENABLED : Wizard.States.ERROR}
          label="Date and Location"
        />
        <Wizard.Step
          state={Wizard.States.ENABLED}
          label="Confidence and Notes"
        />
      </Wizard>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {activeIndex === 0 && (
          <View flex>
            <View marginT-20 marginB-20={draftPhotoIds.length > 0}>
              <PhotoCarousel
                draftPhotoIds={draftPhotoIds}
                onRemovePhoto={removePhoto}
              />
            </View>
            <View flex paddingH-20>
              <AddPhotosButton
                callback={addPhotos}
                numPhotos={draftPhotoIds.length}
                maxPhotos={SELECTION_LIMIT}
              />
              <NamePicker
                name={name}
                onChangeName={({ value }: { value: string }) => setName(value)}
              />
              <Text>
                The name you would apply to this observation. If you don’t know
                what it is, just leave it blank. If you find a better name in
                the future, you can always propose a name later.
              </Text>
              <Text marginT-10>
                <Text style={{ fontWeight: 'bold' }}>
                  Scientific names are currently required,
                </Text>{' '}
                but do not include any author information. If multiple names
                apply, you will be given the option to select between them. If
                the name is not recognized in the database, then you will be
                given the option to add the name or fix the spelling if it’s
                just a typo.
              </Text>
            </View>
          </View>
        )}
        {activeIndex === 1 && (
          <View padding-20>
            <Text marginB-10 grey30>
              Date
            </Text>
            <DateTimePicker
              value={date}
              mode="date"
              themeVariant="light"
              onChange={date => console.log(date)}
            />
            <LocationPicker
              location={location}
              onChangeLocation={({ value }: { value: string }) => {
                setLocation(value);
              }}
            />
            {false && (
              <Button
                marginB-15
                label="Locate"
                disabled={!draftObservation?.location}
                size={Button.sizes.medium}
                onPress={() => {
                  updateDraftObservation({
                    id,
                    changes: { ...draftObservation },
                  });
                  navigation.navigate('Select Location', { id });
                }}
              />
            )}
            <Text marginB-15>
              Where the observation was made. In the US this should be at least
              accurate to the county. Examples:
            </Text>
            <View marginB-15>
              <Text style={{ fontStyle: 'italic' }}>
                Albion, Mendocino Co., California, USA
              </Text>
              <Text style={{ fontStyle: 'italic' }}>
                Hotel Parque dos Coqueiros, Aracaju, Sergipe, Brazil
              </Text>
            </View>
            {false && (
              <Text>
                <Text style={{ fontWeight: 'bold' }}>
                  Use the Locate Button
                </Text>{' '}
                to bring this location up on the map. Then click to add a marker
                and drag it to the specific Latitude & Longitude.
              </Text>
            )}
            <View marginV-15 spread row centerV>
              <Text>Is this location where it was collected?</Text>
              <Switch
                value={isCollectionLocation}
                onValueChange={setIsCollectionLocation}
              />
            </View>
            {false && (
              <View spread row>
                <View flex>
                  <TextField
                    title="Latitude"
                    value={`${latitude || ''}`}
                    maxLength={5}
                    keyboardType="numeric"
                    onChangeText={lat => setLatitude(parseFloat(lat))}
                  />
                </View>
                <View flex marginH-30>
                  <TextField
                    title="Longitude"
                    value={`${longitude || ''}`}
                    maxLength={5}
                    keyboardType="numeric"
                    onChangeText={lng => setLongitude(parseFloat(lng))}
                  />
                </View>
                <View flex>
                  <TextField
                    title="Altitude"
                    value={`${altitude || ''}`}
                    maxLength={5}
                    keyboardType="numeric"
                    onChangeText={alt => setAltitude(parseFloat(alt))}
                  />
                </View>
              </View>
            )}
            <View spread row centerV>
              <Text>Hide exact coordinates?</Text>
              <Switch value={gpsHidden} onValueChange={setGpsHidden} />
            </View>
          </View>
        )}
        {activeIndex === 2 && (
          <View flex padding-20>
            <ConfidencePicker
              confidence={vote}
              onChangeConfidence={({ value }: { value: number }) =>
                setVote(value)
              }
            />
            <NotesField
              placeholder={NOTES_DETAILS}
              notes={notes}
              onChangeNotes={setNotes}
            />
          </View>
        )}
      </ScrollView>
      <View row spread marginT-20 marginH-20 marginB-40>
        <Button label="Back" disabled={activeIndex === 0} onPress={back} />
        <Button label="Next" disabled={activeIndex === 2} onPress={next} />
      </View>
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

const mapStateToProps = (state: any, ownProps: any) => ({
  draftObservation: selectById(state, ownProps.id),
  draftImages: selectAll(state),
});

const mapDispatchToProps = {
  updateDraftObservation: updateDraftObservationAction,
  removeDraftObservation: removeDraftObservationAction,
  addObservation: addObservationAction,
  updateObservation: updateObservationAction,
  addImage: addImageAction,
  addDraftImages: addDraftImagesAction,
  removeDraftImage: removeDraftImageAction,
  setInfo: setInfoAction,
  setWarning: setWarningAction,
  setError: setErrorAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const ConnectedWizard = connector(DraftWizard);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default withForwardedNavigationParams<ForwardedCreateDraftProps>()(
  ConnectedWizard,
);
