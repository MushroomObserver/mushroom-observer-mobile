import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SelectLocation from './SelectLocation';
import NameAndPhotos from './NameAndPhotos';
import Name from './Name';
import TimeAndLocation from './TimeAndLocation';
import IdentificationAndNotes from './IdentificationAndNotes';
import EditPhoto from '../EditPhoto';

const Stack = createNativeStackNavigator();

const CreateObservation = () => (
  <Stack.Navigator>
    <Stack.Screen name="Name and Photos" component={NameAndPhotos} />
    <Stack.Screen name="Time and Location" component={TimeAndLocation} />
    <Stack.Screen name="Select Location" component={SelectLocation} />
    <Stack.Screen
      name="Identification and Notes"
      component={IdentificationAndNotes}
    />
    <Stack.Screen name="Edit Photo" component={EditPhoto} />
  </Stack.Navigator>
);

export default CreateObservation;
