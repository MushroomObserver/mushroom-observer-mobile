import React from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useDispatch} from 'react-redux';
import {Row, Field, Label, Sublabel} from '../components';
import {useAuth} from '../hooks/useAuth';
import {logout} from '../store/auth';

const Settings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const auth = useAuth();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{marginRight: 15}}>
          <Button
            title="Logout"
            onPress={() =>
              Alert.alert('Logout', 'Are you sure?', [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => dispatch(logout()),
                },
              ])
            }
          />
        </View>
      ),
    });
  }, [dispatch, navigation]);

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Field>
          <Row>
            <Label>Logged in as</Label>
            <Sublabel>{auth.user.login_name}</Sublabel>
          </Row>
        </Field>
        <Field>
          <Row>
            <Label>Current API key</Label>
            <Sublabel>{`********************${auth.key.substring(
              auth.key.length - 4,
              auth.key.length,
            )}`}</Sublabel>
          </Row>
        </Field>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
