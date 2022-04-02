import useDayjs from '../../hooks/useDayjs';
import {
  selectIds,
  addDraftObservation as addDraftObservationAction,
} from '../../store/draftObservations';
import DraftListEmptyView from './DraftListEmptyView';
import DraftListItem from './DraftListItem';
import { useNavigation } from '@react-navigation/core';
import { nanoid } from '@reduxjs/toolkit';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { FloatingButton, Spacings, View } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect, ConnectedProps } from 'react-redux';

interface DraftListProps extends PropsFromRedux {}

const DraftList = ({
  draftObservationIds,
  addDraftObservation,
}: DraftListProps) => {
  const navigation = useNavigation();
  const dayjs = useDayjs();
  return (
    <View flex>
      <FlatList
        data={draftObservationIds}
        ListEmptyComponent={DraftListEmptyView}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={({ item }) => <DraftListItem id={item} key={item} />}
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

const ConnectedDraftList = connector(DraftList);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default ConnectedDraftList;
