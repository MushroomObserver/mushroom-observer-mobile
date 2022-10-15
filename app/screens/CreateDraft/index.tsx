import AddPhotosButton from '../../components/AddPhotosButton';
import { ConfidencePicker } from '../../components/ConfidencePicker';
import LocationPicker from '../../components/LocationPicker';
import NamePicker from '../../components/NamePicker';
import { NotesField } from '../../components/NotesField';
import { FormGroup } from '../../components/base/FormGroup';
import { TextField } from '../../components/base/TextField';
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
import { PostObservationRequestParams } from '../../types/api';
import { ForwardedCreateDraftProps } from '../../types/navigation';
import { DraftObservation } from '../../types/store';
import PhotoCarousel from './PhotoCarousel';
import { useNavigation } from '@react-navigation/native';
import { nanoid } from '@reduxjs/toolkit';
import _, { clamp, get, omitBy, isUndefined, filter, concat } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import GetLocation from 'react-native-get-location';
import { Callback, ImagePickerResponse } from 'react-native-image-picker';
import {
  Wizard,
  View,
  Button,
  Text,
  Switch,
  DateTimePicker,
  LoaderScreen,
  Colors,
} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';
import { HiddenItem, Item } from 'react-navigation-header-buttons';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';
import { connect, ConnectedProps } from 'react-redux';
import { act } from 'react-test-renderer';

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
  const [date, setDate] = useState(draftObservation?.date);
  const [latitude, setLatitude] = useState(draftObservation?.latitude);
  const [longitude, setLongitude] = useState(draftObservation?.longitude);
  const [altitude, setAltitude] = useState(draftObservation?.altitude);
  const [location, setLocation] = useState(draftObservation?.location);
  const [isLocating, setIsLocating] = useState(false);
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

  useEffect(() => {
    updateDraftObservation({
      id,
      changes: {
        date: dayjs(date).format('YYYYMMDD'),
        latitude,
        longitude,
        altitude,
        gpsHidden,
        name,
        location,
        isCollectionLocation,
        vote,
        notes,
        draftPhotoIds,
      },
    });
  }, [activeIndex]);

  const uploadObservation = useCallback(
    ({
      name,
      date,
      location,
      isCollectionLocation,
      latitude,
      longitude,
      altitude,
      gpsHidden,
      vote,
      notes,
    }) => {
      setIsLoading(true);
      postObservation({
        api_key: apiKey,
        name,
        date: dayjs(date).format('YYYYMMDD'),
        location,
        isCollectionLocation,
        latitude,
        longitude,
        altitude,
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
                    date: image?.date
                      ? dayjs(image.date).format('YYYYMMDD')
                      : undefined,
                    license: image?.license?.value,
                    md5sum: image?.md5,
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
                    .catch(e => console.log('image upload failed', e)),
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
    },
    [
      name,
      date,
      location,
      isCollectionLocation,
      latitude,
      longitude,
      altitude,
      gpsHidden,
      vote,
      notes,
      draftImages,
    ],
  );

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
                  date: dayjs(date).format('YYYYMMDD'),
                  latitude,
                  longitude,
                  altitude,
                  gpsHidden,
                  name,
                  location,
                  isCollectionLocation,
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
              onPress={() =>
                uploadObservation({
                  name,
                  date,
                  location,
                  isCollectionLocation,
                  latitude,
                  longitude,
                  altitude,
                  gpsHidden,
                  vote,
                  notes,
                })
              }
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
    latitude,
    longitude,
    altitude,
    isCollectionLocation,
    gpsHidden,
    vote,
    notes,
    draftPhotoIds,
  ]);

  useEffect(() => {
    const getGPS = async () => {
      const gps = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });
      console.log('gps', gps);
      if (gps.latitude) setLatitude(gps.latitude.toFixed(4));
      if (gps.longitude) setLongitude(gps.longitude.toFixed(4));
      if (gps.altitude) setAltitude(gps.altitude.toFixed(2));
    };
    // getGPS();
  }, []);

  const jsCoreDateCreator = (dateString: string) => {
    let dateParams = dateString.split('T');
    return dayjs(dateParams[0], 'YYYY-MM-DD').toString();
  };

  const addPhotos: Callback = async ({
    didCancel,
    assets,
  }: ImagePickerResponse) => {
    if (!didCancel && assets) {
      const newIds: string[] = [];
      let date = undefined;
      const draftImages = assets.map(asset => {
        let { timestamp } = asset;
        const newId = nanoid();
        newIds.push(newId);
        if (timestamp) {
          timestamp = jsCoreDateCreator(timestamp);
        }
        console.log(asset);
        return {
          ...asset,
          id: newId,
          draftObservationId: id,
          date: timestamp,
        };
      });
      addDraftImages(draftImages);
      setDraftPhotoIds(concat(draftPhotoIds, newIds));
      updateDraftObservation({ id, changes: { name, draftPhotoIds, date } });
    }
  };

  const useInfo = (date, latitude, longitude, altitude) => {
    if (date) {
      setDate(date);
    }
    if (latitude) {
      setLatitude(latitude?.toFixed(4));
    }
    if (latitude) {
      setLongitude(longitude?.toFixed(4));
    }
    if (latitude) {
      setAltitude(altitude?.toFixed(2));
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
        <Wizard.Step
          state={Wizard.States.ENABLED}
          label="Photos, Date, and GPS"
        />
        <Wizard.Step state={Wizard.States.ENABLED} label="Name and Location" />
        <Wizard.Step
          state={Wizard.States.ENABLED}
          label="Confidence and Notes"
        />
      </Wizard>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {activeIndex === 0 && (
          <>
            <View marginT-s4={draftPhotoIds.length > 0}>
              <PhotoCarousel
                draftPhotoIds={draftPhotoIds}
                onUseInfo={useInfo}
                onRemovePhoto={removePhoto}
              />
            </View>
            <View flex margin-s4>
              <View marginB-s4>
                <AddPhotosButton
                  callback={addPhotos}
                  numPhotos={draftPhotoIds.length}
                  maxPhotos={SELECTION_LIMIT}
                />
              </View>
              <FormGroup>
                <Text marginB-s2 text80 textDefault>
                  Date
                </Text>
                <DateTimePicker
                  value={dayjs(date).toDate()}
                  dateFormat="YYYY-MM-DD"
                  mode="date"
                  themeVariant="light"
                  onChange={setDate}
                />
                <View spread row>
                  <View flex>
                    <TextField
                      preset="default"
                      label="Latitude"
                      value={_.toString(latitude)}
                      maxLength={5}
                      keyboardType="numeric"
                      onChangeText={setLatitude}
                    />
                  </View>
                  <View flex marginH-s2>
                    <TextField
                      preset="default"
                      label="Longitude"
                      value={_.toString(longitude)}
                      maxLength={5}
                      keyboardType="numeric"
                      onChangeText={setLongitude}
                    />
                  </View>
                  <View flex>
                    <TextField
                      preset="default"
                      label="Altitude"
                      value={_.toString(altitude)}
                      formatter={value => (value ? `${value}m` : undefined)}
                      maxLength={4}
                      keyboardType="numeric"
                      onChangeText={setAltitude}
                    />
                  </View>
                </View>
                <View row spread centerV marginB-s4>
                  <Text text80R>Use Current Location</Text>
                  <View flex right>
                    <Button
                      size={Button.sizes.xSmall}
                      disabled={isLocating}
                      iconSource={() => (
                        <View marginR-5>
                          {isLocating ? (
                            <ActivityIndicator
                              size="small"
                              color={Colors.white}
                            />
                          ) : (
                            <Icon name="globe" size={15} color="white" />
                          )}
                        </View>
                      )}
                      label="Locate"
                      onPress={async () => {
                        setIsLocating(true);
                        const gps = await GetLocation.getCurrentPosition({
                          enableHighAccuracy: true,
                          timeout: 15000,
                        });
                        if (gps.latitude) setLatitude(gps.latitude.toFixed(4));
                        if (gps.longitude)
                          setLongitude(gps.longitude.toFixed(4));
                        if (gps.altitude) setAltitude(gps.altitude.toFixed(2));
                        setIsLocating(false);
                      }}
                    />
                  </View>
                </View>
                <View spread row centerV>
                  <Text>Hide exact coordinates?</Text>
                  <Switch value={gpsHidden} onValueChange={setGpsHidden} />
                </View>
              </FormGroup>
            </View>
          </>
        )}
        {activeIndex === 1 && (
          <>
            <FormGroup margin-s4>
              <NamePicker name={name} onChangeName={setName} />
            </FormGroup>
            <FormGroup margin-s4 marginT-0>
              <LocationPicker
                location={location}
                onChangeLocation={setLocation}
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
                Where the observation was made. In the US this should be at
                least accurate to the county. Examples:
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
                  to bring this location up on the map. Then click to add a
                  marker and drag it to the specific Latitude & Longitude.
                </Text>
              )}
              <View marginV-15 spread row centerV>
                <Text>Is this location where it was collected?</Text>
                <Switch
                  value={isCollectionLocation}
                  onValueChange={setIsCollectionLocation}
                />
              </View>
            </FormGroup>
          </>
        )}
        {activeIndex === 2 && (
          <>
            <FormGroup margin-s4>
              <ConfidencePicker
                confidence={vote}
                onChangeConfidence={setVote}
              />
            </FormGroup>
            <FormGroup margin-s4 marginT-0>
              <NotesField
                placeholder={NOTES_DETAILS}
                notes={notes}
                onChangeNotes={setNotes}
              />
            </FormGroup>
          </>
        )}
        <View row spread margin-s4 marginT-0>
          <Button label="Back" disabled={activeIndex === 0} onPress={back} />
          {(activeIndex === 2 && (
            <Button
              label="Upload"
              backgroundColor={Colors.green30}
              onPress={() =>
                uploadObservation({
                  name,
                  date,
                  location,
                  isCollectionLocation,
                  latitude,
                  longitude,
                  altitude,
                  gpsHidden,
                  vote,
                  notes,
                })
              }
            />
          )) || (
            <Button label="Next" disabled={activeIndex === 2} onPress={next} />
          )}
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
