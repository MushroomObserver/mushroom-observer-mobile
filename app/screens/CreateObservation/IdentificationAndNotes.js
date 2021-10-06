import { useNavigation } from '@react-navigation/core';
import { isEmpty, omitBy } from 'lodash';
import React, { useLayoutEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet } from 'react-native';
import { Picker, Text, TextField, View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';

import { useAuth } from '../../hooks/useAuth';
import { selectKey } from '../../store/auth';
import { clearDraft, selectDraft } from '../../store/draft';
import { usePostObservationMutation } from '../../store/mushroomObserver';

const IdentificationAndNotes = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const navigation = useNavigation();
  const draft = useSelector(selectDraft);
  const key = useSelector(selectKey);

  const [vote, setVote] = useState(draft.vote);
  const [notes, setNotes] = useState(draft.notes);
  const [
    postObservation, // This is the mutation trigger
    { data }, // This is the destructured mutation result
  ] = usePostObservationMutation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Save"
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'My Observations' }],
            });
            dispatch(clearDraft());
            const observation = omitBy(draft, isEmpty);
            console.log(observation);
            // postObservation({ observation, key });
          }}
        />
      ),
    });
  }, [auth, dispatch, draft, navigation, postObservation, key]);

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View flex padding-30>
          <Picker title="Confidence" onChange={setVote} value={vote}>
            <Picker.Item value={3.0} label="I'd Call It That" />
            <Picker.Item value={2.0} label="Promising" />
            <Picker.Item value={1.0} label="Could Be" />
            <Picker.Item value={-1.0} label="Doubtful" />
            <Picker.Item value={-2.0} label="Not Likely" />
            <Picker.Item value={-3.0} label="As If!" />
          </Picker>
          <TextField
            title="Notes"
            value={notes}
            onChangeText={setNotes}
            expandable
            multiline
          />
          <Text>
            Please include any additional information you can think of about
            this observation that isn’t clear from the photographs, e.g.,
            habitat, substrate or nearby trees; distinctive texture, scent,
            taste, staining or bruising; results of chemical or microscopic
            analyses, etc.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    color: '#007bff',
    margin: 8,
    fontSize: 18,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 18,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default IdentificationAndNotes;
