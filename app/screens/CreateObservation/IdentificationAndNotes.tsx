import { useAuth } from '../../hooks/useAuth';
import { selectKey } from '../../store/auth';
import { clearDraft, selectDraft } from '../../store/draft';
import { usePostObservationMutation } from '../../store/mushroomObserver';
import { addObservation } from '../../store/observations';
import { useNavigation } from '@react-navigation/core';
import { isEmpty, omitBy } from 'lodash';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Button, ScrollView } from 'react-native';
import {
  Colors,
  Picker,
  Text,
  Toast,
  TextField,
  View,
} from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';

const IdentificationAndNotes = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const navigation = useNavigation();
  const draft = useSelector(selectDraft);
  const api_key = useSelector(selectKey);

  const [vote, setVote] = useState(draft.vote);
  const [notes, setNotes] = useState(draft.notes);
  const [
    postObservation, // This is the mutation trigger
    { data }, // This is the destructured mutation result
  ] = usePostObservationMutation();
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Save"
          onPress={() => {
            const observation = omitBy(draft, isEmpty);
            postObservation({ ...observation, api_key });
          }}
        />
      ),
    });
  }, [auth, dispatch, draft, navigation, postObservation, api_key]);

  useEffect(() => {
    if (data?.results) {
      dispatch(clearDraft(undefined));
      dispatch(addObservation(data.results[0]));
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }

    if (data?.errors) {
      setShowToast(true);
      setErrorMessage(data.errors[0].details);
    }
  });

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
      <Toast
        backgroundColor={Colors.red30}
        position="top"
        visible={showToast}
        message={errorMessage}
        // autoDismiss={3000}
        showDismiss
        onDismiss={() => setShowToast(false)}
      />
    </View>
  );
};

export default IdentificationAndNotes;
