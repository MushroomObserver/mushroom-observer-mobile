import DraftPhoto from '../components/DraftPhoto';
import { NotesField } from '../components/NotesField';
import { FormGroup } from '../components/base/FormGroup';
import { TextField } from '../components/base/TextField';
import useDayjs from '../hooks/useDayjs';
import {
  selectById,
  updateDraftImage as updateDraftImageAction,
} from '../store/draftImages';
import { ForwardedCreatePhotoProps } from '../types/navigation';
import { useNavigation } from '@react-navigation/core';
import React, { useLayoutEffect, useState } from 'react';
import { Button as NativeButton, Dimensions, ScrollView } from 'react-native';
import { Picker, Text, View, DateTimePicker } from 'react-native-ui-lib';
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
  const [date, setDate] = useState(dayjs(draftImage.date).toDate());
  const [license, setLicense] = useState<string>(draftImage.license);
  const [notes, setNotes] = useState<string>(draftImage.notes);

  const notesDetails =
    'Enter notes that are specific to this particular image.';

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
        <FormGroup margin-s4 padding-s2>
          <TextField
            preset="default"
            label="Copyright Holder"
            value={copyrightHolder}
            onChangeText={setCopyrightHolder}
          />
          <Text marginB-s2 text80 textDefault>
            Date
          </Text>
          <DateTimePicker
            value={date}
            maximumDate={new Date()}
            themeVariant="light"
            mode="date"
            onChange={setDate}
          />
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
          <NotesField
            placeholder={notesDetails}
            notes={notes}
            onChangeNotes={setNotes}
          />
        </FormGroup>
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
