import { selectIds } from '../../store/draftObservations';
import DraftListEmptyView from './DraftListEmptyView';
import DraftListItem from './DraftListItem';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';
import { connect, ConnectedProps, useSelector } from 'react-redux';

interface DraftListProps extends PropsFromRedux {}

const DraftList = ({ draftObservationIds }: DraftListProps) => {
  return (
    <View flex>
      <FlatList
        data={draftObservationIds}
        ListEmptyComponent={DraftListEmptyView}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={({ item }) => <DraftListItem id={item} key={item} />}
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

const connector = connect(mapStateToProps);

const ConnectedDraftList = connector(DraftList);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default ConnectedDraftList;
