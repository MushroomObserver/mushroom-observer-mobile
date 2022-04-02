import useDayjs from '../../hooks/useDayjs';
import { addDraftObservation as addDraftObservationAction } from '../../store/draftObservations';
import { selectIds } from '../../store/observations';
import ObservationListEmptyView from './ObservationListEmptyView';
import ObservationListItem from './ObservationListItem';
import { useNavigation } from '@react-navigation/core';
import { nanoid } from '@reduxjs/toolkit';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import {
  ButtonSize,
  FloatingButton,
  Spacings,
  View,
} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect, ConnectedProps } from 'react-redux';

interface ObservationListProps extends PropsFromRedux {}

const ObservationList = ({
  draftObservationIds,
  addDraftObservation,
}: ObservationListProps) => {
  const navigation = useNavigation();
  const dayjs = useDayjs();

  return (
    <View flex>
      <FlatList
        data={draftObservationIds}
        ListEmptyComponent={ObservationListEmptyView}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={({ item }) => <ObservationListItem id={item} key={item} />}
      />
      <FloatingButton
        visible
        bottomMargin={Spacings.s4}
        button={{
          label: 'Create Observation',
          size: 'medium',
          onPress: () => {
            const id = nanoid();
            addDraftObservation({
              id,
              date: dayjs(new Date()).format('YYYYMMDD'),
              draftPhotoIds: [],
            });
            navigation.navigate('Create Draft', { id });
          },
          iconSource: () => (
            <View marginR-10>
              <Icon name="eye" size={25} color="white" />
            </View>
          ),
        }}
        hideBackgroundOverlay
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
});

const mapStateToProps = (state: any, ownProps: any) => ({
  draftObservationIds: selectIds(state),
});

const mapDispatchToProps = {
  addDraftObservation: addDraftObservationAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConnectedObservationList = connector(ObservationList);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default ConnectedObservationList;
