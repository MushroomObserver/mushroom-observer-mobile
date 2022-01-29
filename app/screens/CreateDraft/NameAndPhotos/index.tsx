import AddPhotosButton from '../../../components/AddPhotosButton';
import DraftPhoto from '../../../components/DraftPhoto';
import NamePicker from '../../../components/NamePicker';
import {
  addDraftImages as addDraftImagesAction,
  removeDraftImage as removeDraftImageAction,
} from '../../../store/draftImages';
import {
  selectById,
  updateDraftObservation as updateDraftObservationAction,
  removeDraftObservation as removeDraftObservationAction,
} from '../../../store/draftObservations';
import { ForwardedNameAndPhotosProps } from '../../../types/navigation';
import { useNavigation } from '@react-navigation/core';
import { nanoid } from '@reduxjs/toolkit';
import { concat, filter, sortBy } from 'lodash';
import React, { useLayoutEffect, useState } from 'react';
import {
  Alert,
  Button as NativeButton,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Callback, ImagePickerResponse } from 'react-native-image-picker';
import { Carousel, Chip, Colors, Text, View } from 'react-native-ui-lib';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';
import { connect, ConnectedProps } from 'react-redux';

const { width: screenWidth } = Dimensions.get('window');

interface NameAndPhotosProps extends PropsFromRedux {
  id: string;
}

interface PhotoProps {
  id: string;
  onRemovePhoto: Function;
}

const Photo = ({ id, onRemovePhoto }: PhotoProps) => {
  const navigation = useNavigation();
  return (
    <View>
      <DraftPhoto
        id={id}
        key={id}
        width={screenWidth - 40}
        height={220}
        borderRadius={11}
      />

      <View flex row spread marginT-5 width={screenWidth - 40}>
        <Chip
          backgroundColor={Colors.white}
          label="Remove"
          onPress={() => {
            onRemovePhoto(id);
          }}
          labelStyle={{ color: Colors.white }}
          containerStyle={{
            borderColor: Colors.red20,
            backgroundColor: Colors.red20,
          }}
        />
        <Chip
          backgroundColor={Colors.white}
          label="Edit"
          onPress={() =>
            navigation.navigate('Create Photo', {
              id,
            })
          }
          labelStyle={{ color: Colors.white }}
          containerStyle={{
            borderColor: Colors.primary,
            backgroundColor: Colors.primary,
          }}
        />
      </View>
    </View>
  );
};

const NameAndPhotos = ({
  id,
  draftObservation,
  updateDraftObservation,
  removeDraftObservation,
  addDraftImages,
  removeDraftImage,
}: NameAndPhotosProps) => {
  const navigation = useNavigation();
  const [name, setName] = useState(draftObservation?.name);
  let draftPhotoIds = draftObservation?.draftPhotoIds || [];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <NativeButton
          title="Cancel"
          onPress={() =>
            Alert.alert(
              'Discard Observation',
              'Do you want to discard this observation or save it for later?',
              [
                {
                  text: 'Discard',
                  style: 'cancel',
                  onPress: () => {
                    removeDraftObservation(id);
                    navigation.navigate('Home', {
                      screen: 'My Observations',
                    });
                  },
                },
                {
                  text: 'Save',
                  onPress: () => {
                    updateDraftObservation({
                      id,
                      changes: { name, draftPhotoIds },
                    });
                    navigation.navigate('Home', {
                      screen: 'My Drafts',
                    });
                  },
                },
              ],
            )
          }
        />
      ),
      headerRight: () => (
        <NativeButton
          title="Next"
          onPress={() => {
            updateDraftObservation({ id, changes: { name, draftPhotoIds } });
            navigation.navigate('Time and Location', { id });
          }}
        />
      ),
    });
  }, [name, navigation]);

  const addPhotos: Callback = async ({
    didCancel,
    assets,
  }: ImagePickerResponse) => {
    if (!didCancel && assets) {
      const newIds: string[] = [];
      const draftImages = assets.map(asset => {
        const newId = nanoid();
        newIds.push(newId);
        return { ...asset, id: newId, draftObservationId: id };
      });
      addDraftImages(draftImages);

      draftPhotoIds = concat(draftPhotoIds, newIds);
      updateDraftObservation({ id, changes: { name, draftPhotoIds } });
    }
  };

  const removePhoto = (photoId: string) => {
    draftPhotoIds = filter(draftPhotoIds, draftId => draftId != photoId);
    removeDraftImage(photoId);
    updateDraftObservation({ id, changes: { name, draftPhotoIds } });
  };

  const SELECTION_LIMIT = 12;

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {(draftPhotoIds && draftPhotoIds.length > 0 && (
          <Carousel
            horizontal
            containerMarginHorizontal={20}
            containerPaddingVertical={10}
            allowAccessibleLayout
            pageControlPosition={Carousel.pageControlPositions.OVER}
            pageControlProps={{
              color: Colors.primary,
              inactiveColor: Colors.grey30,
            }}
          >
            {draftPhotoIds.map(id => (
              <Photo key={id} id={id} onRemovePhoto={removePhoto} />
            ))}
          </Carousel>
        )) || <View margin-10 />}
        <View flex paddingH-20>
          <AddPhotosButton
            callback={addPhotos}
            numPhotos={draftPhotoIds.length}
            maxPhotos={SELECTION_LIMIT}
          />
          <NamePicker
            name={name}
            onChangeName={item => {
              setName(item.value);
            }}
          />
          <Text>
            The name you would apply to this observation. If you don’t know what
            it is, just leave it blank. If you find a better name in the future,
            you can always propose a name later.
          </Text>
          <Text marginT-10>
            <Text style={{ fontWeight: 'bold' }}>
              Scientific names are currently required,
            </Text>{' '}
            but do not include any author information. If multiple names apply,
            you will be given the option to select between them. If the name is
            not recognized in the database, then you will be given the option to
            add the name or fix the spelling if it’s just a typo.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: any, ownProps: any) => ({
  draftObservation: selectById(state, ownProps.id),
});

const mapDispatchToProps = {
  addDraftImages: addDraftImagesAction,
  updateDraftObservation: updateDraftObservationAction,
  removeDraftObservation: removeDraftObservationAction,
  removeDraftImage: removeDraftImageAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConnectedNameAndPhotos = connector(NameAndPhotos);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default withForwardedNavigationParams<ForwardedNameAndPhotosProps>()(
  ConnectedNameAndPhotos,
);
