import ListItemLayout from '../../components/layouts/ListItemLayout';
import useDayjs from '../../hooks/useDayjs';
import { selectById as selectDraftImageById } from '../../store/draftImages';
import {
  selectById as selectDraftObservationById,
  removeDraftObservation as removeDraftObservationAction,
} from '../../store/draftObservations';
import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Colors, Drawer } from 'react-native-ui-lib';
import { connect, ConnectedProps } from 'react-redux';

interface DraftListItemProps extends PropsFromRedux {
  id: string;
}

const DraftListItem = ({
  id,
  draftObservation,
  draftPhoto,
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
      <ListItemLayout
        uri={draftPhoto?.uri}
        title={`Draft`}
        date={draftObservation?.date}
        name={draftObservation?.name}
        location={draftObservation?.location}
        onPress={() => navigation.navigate('Edit Draft', { id })}
      />
    </Drawer>
  );
};

const mapStateToProps = (state: any, ownProps: any) => {
  const draftObservation = selectDraftObservationById(state, ownProps.id);
  const draftPhoto = selectDraftImageById(
    state,
    draftObservation?.draftPhotoIds[0],
  );
  return {
    draftObservation,
    draftPhoto,
  };
};

const mapDispatchToProps = {
  removeDraftObservation: removeDraftObservationAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConnectedDraftListItem = connector(DraftListItem);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default ConnectedDraftListItem;
