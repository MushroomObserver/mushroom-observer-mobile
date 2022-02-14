import { OwnerView } from '../components/OwnerView';
import Photo from '../components/Photo';
import HeaderButtons from '../components/header/HeaderButtons';
import useDayjs from '../hooks/useDayjs';
import { selectById } from '../store/images';
import { ForwardedViewPhotoProps } from '../types/navigation';
import { Image as ImageType } from '../types/store';
import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useLayoutEffect } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { Item } from 'react-navigation-header-buttons';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';
import { connect } from 'react-redux';

interface ViewPhotoProps {
  id: string;
  photo: ImageType;
}

const { width: screenWidth } = Dimensions.get('window');
const ViewPhoto = ({ id, photo }: ViewPhotoProps) => {
  const navigation = useNavigation();
  const route = useRoute();
  const dayjs = useDayjs();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Photo #${id}`,
      headerRight: () => (
        <HeaderButtons>
          <Item
            title="Edit"
            onPress={() => navigation.navigate('Edit Photo', { id })}
            disabled
          />
        </HeaderButtons>
      ),
    });
  }, [navigation, route]);

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View padding-20>
          <Photo
            id={id}
            height={480}
            borderRadius={11}
            width={screenWidth - 40}
          />
          {photo && (
            <View>
              <Text text70H>
                Date: <Text text70>{dayjs(photo.date).format('ll')}</Text>
              </Text>
              <Text text70H>
                Owner:{' '}
                <Text text70>
                  <OwnerView owner={photo.owner} />
                </Text>
              </Text>
              <Text text70H>
                License: <Text text70>{photo.license}</Text>
              </Text>
            </View>
          )}
          {photo?.notes && (
            <Text text70H>
              Notes:{' '}
              <Text text70>{photo.notes.replace(/<(.|\n)*?>/g, '')}</Text>
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: any, ownProps: ViewPhotoProps) => ({
  photo: selectById(state, ownProps.id),
});

const ConnectedViewPhoto = connect(mapStateToProps)(ViewPhoto);

export default withForwardedNavigationParams<ForwardedViewPhotoProps>()(
  ConnectedViewPhoto,
);
