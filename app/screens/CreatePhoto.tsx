import DraftPhoto from '../components/DraftPhoto';
import useDayjs from '../hooks/useDayjs';
import {
  selectById,
  updateDraftImage as updateDraftImageAction,
} from '../store/draftImages';
import { ForwardedCreatePhotoProps } from '../types/navigation';
import { useNavigation } from '@react-navigation/core';
import React, { useLayoutEffect, useState } from 'react';
import { Button as NativeButton, Dimensions, ScrollView } from 'react-native';
import {
  Picker,
  Text,
  TextField,
  View,
  DateTimePicker,
} from 'react-native-ui-lib';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';
import { connect, ConnectedProps } from 'react-redux';

const { width: screenWidth } = Dimensions.get('window');

interface CreatePhotoProps extends PropsFromRedux {
  id: string;
  draftImage: any;
}

const CreatePhoto = ({
  id,
  draftImage,
  updateDraftImage,
}: CreatePhotoProps) => {
  const navigation = useNavigation();
  const dayjs = useDayjs();
  const [copyrightHolder, setCopyrightHolder] = useState(
    draftImage.copyrightHolder,
  );
  const [date, setDate] = useState(new Date());
  const [license, setLicense] = useState<string>(draftImage.license);
  const [notes, setNotes] = useState<string>(draftImage.notes);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <NativeButton
          title="Save"
          onPress={() => {
            updateDraftImage({
              id: draftImage.id,
              changes: {
                date: dayjs(date).format('YYYYMMDD'),
                copyrightHolder,
                license,
                notes,
              },
            });
            navigation.goBack();
          }}
        />
      ),
    });
  }, [navigation, copyrightHolder, date, license, notes]);

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View centerH marginT-10>
          <DraftPhoto
            id={id}
            width={screenWidth - 40}
            height={200}
            borderRadius={10}
          />
        </View>
        <View padding-20>
          <TextField
            title="Copyright Holder"
            value={copyrightHolder}
            onChangeText={setCopyrightHolder}
          />
          <DateTimePicker
            title={'Date'}
            value={date}
            maximumDate={new Date()}
            mode="date"
            display="default"
            onChange={setDate}
          />
          <Text marginT-0 marginB-20>
            Date the photograph or drawing was created.
          </Text>
          <Picker title="License" onChange={setLicense} value={license}>
            <Picker.Item
              value={3.0}
              label="Creative Commons Non-commercial v3.0"
            />
            <Picker.Item
              value={2.0}
              label="Creative Commons Wikipedia Compatible v3.0"
            />
            <Picker.Item value={1.0} label="Public Domain" />
          </Picker>
          <TextField
            title="Notes"
            value={notes}
            onChangeText={setNotes}
            expandable
            multiline
          />
          <Text>Enter notes that are specific to this particular image.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: any, ownProps: any) => ({
  draftImage: selectById(state, ownProps.id),
});

const mapDispatchToProps = {
  updateDraftImage: updateDraftImageAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConnectedCreatePhoto = connector(CreatePhoto);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default withForwardedNavigationParams<ForwardedCreatePhotoProps>()(
  ConnectedCreatePhoto,
);
