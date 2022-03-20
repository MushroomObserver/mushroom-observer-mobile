import DraftPhoto from '../../components/DraftPhoto';
import NoPhoto from '../../components/NoPhoto';
import useDayjs from '../../hooks/useDayjs';
import {
  selectById,
  removeDraftObservation as removeDraftObservationAction,
} from '../../store/draftObservations';
import { useNavigation } from '@react-navigation/core';
import { get } from 'lodash';
import React from 'react';
import { Card, Colors, Drawer, Text, View } from 'react-native-ui-lib';
import { connect, ConnectedProps } from 'react-redux';

interface DraftListItemProps extends PropsFromRedux {
  id: string;
}

const DraftListItem = ({
  id,
  draftObservation,
  removeDraftObservation,
}: DraftListItemProps) => {
  const navigation = useNavigation();
  const dayjs = useDayjs();

  return (
    <Drawer
      useNativeAnimations
      rightItems={[
        {
          text: 'Delete',
          background: Colors.red30,
          onPress: () => removeDraftObservation(id),
        },
      ]}
    >
      <Card
        flex
        row
        marginV-5
        marginH-10
        borderRadius={10}
        enableShadow
        onPress={() => navigation.navigate('Edit Draft', { id })}
      >
        <View flex flexG padding-7 height={90}>
          <Text>Date: {dayjs(draftObservation?.date).format('ll')}</Text>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {draftObservation?.name}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {draftObservation?.location}
          </Text>
        </View>
        {(get(draftObservation, 'draftPhotoIds[0]') && (
          <DraftPhoto
            id={get(draftObservation, 'draftPhotoIds[0]')}
            width={90}
            height={90}
            borderTopRightRadius={10}
            borderBottomRightRadius={10}
          />
        )) || (
          <NoPhoto
            width={90}
            height={90}
            borderTopRightRadius={10}
            borderBottomRightRadius={10}
          />
        )}
      </Card>
    </Drawer>
  );
};

const mapStateToProps = (state: any, ownProps: any) => ({
  draftObservation: selectById(state, ownProps.id),
});

const mapDispatchToProps = {
  removeDraftObservation: removeDraftObservationAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConnectedDraftListItem = connector(DraftListItem);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default ConnectedDraftListItem;
