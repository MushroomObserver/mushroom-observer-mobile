import { DateView } from '../components/DateView';
import { OwnerView } from '../components/OwnerView';
import Photo from '../components/Photo';
import HeaderButtons from '../components/header/HeaderButtons';
import useDayjs from '../hooks/useDayjs';
import getImageUri from '../hooks/useGetImageUri';
import { selectById } from '../store/images';
import { ForwardedViewPhotoProps } from '../types/navigation';
import { Image as ImageType } from '../types/store';
import { useNavigation, useRoute } from '@react-navigation/core';
import { nth } from 'lodash';
import React, { useLayoutEffect } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { Card, Image, Text, View } from 'react-native-ui-lib';
import { Item } from 'react-navigation-header-buttons';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';
import { connect } from 'react-redux';

interface ViewPhotoProps {
  id: string;
  photo: ImageType;
}

const ViewPhoto = ({ id, photo }: ViewPhotoProps) => {
  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View padding-20>
          <Card>
            <View row spread padding-s2>
              <Text text80M grey10>
                Photo #{id}
              </Text>
              <Text text80M grey30>
                <DateView date={photo.date} format="ll" />
              </Text>
            </View>
            <Image
              aspectRatio={photo.width / photo.height}
              source={{ uri: getImageUri(nth(photo.files, -3)) }}
            />
            <View padding-s2>
              <Text text90M grey10>
                License
              </Text>
              <Text text90L marginB-s2>
                {photo.license}
              </Text>
              <Text text90M grey10>
                Notes
              </Text>
              <Text text90R grey10 marginB-s2>
                {photo.notes?.replace(/<(.|\n)*?>/g, '')}
              </Text>
              <View flex row spread>
                <View>
                  <Text text100M grey10>
                    Owner
                  </Text>
                  <Text text100L>
                    <OwnerView owner={photo.owner} />
                  </Text>
                </View>
                <View>
                  <Text text100M grey10>
                    Created At
                  </Text>
                  <Text text100L>
                    <DateView date={photo.created_at} format="lll" />
                  </Text>
                </View>
                <View>
                  <Text text100M grey10>
                    Updated At
                  </Text>
                  <Text text100L>
                    <DateView date={photo.updated_at} format="lll" />
                  </Text>
                </View>
              </View>
            </View>
          </Card>
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
