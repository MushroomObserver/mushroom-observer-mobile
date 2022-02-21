import { FormGroup } from '../components/base/FormGroup';
import { TextField } from '../components/base/TextField';
import HeaderButtons from '../components/header/HeaderButtons';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import React, { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import {
  Button,
  Colors,
  ConnectionStatusBar,
  Image,
  ListItem,
  ProgressBar,
  SkeletonView,
  Text,
  View,
} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Item } from 'react-navigation-header-buttons';

const DevScreen = () => {
  const navigation = useNavigation();
  const auth = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          <Item
            title={'Alert'}
            onPress={() =>
              Alert.alert('Dev Alert', 'This does nothing.', [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => {
                    console.log('Dev Alert');
                  },
                },
              ])
            }
          />
        </HeaderButtons>
      ),
    });
  });
  const [value, setValue] = useState('');

  const TrailingAccessory = () => {
    const [searching, setSearching] = useState(false);

    return (
      <Button
        disabled={searching}
        size={Button.sizes.xSmall}
        iconSource={() => (
          <View marginR-5>
            {searching ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Icon name="eye" size={15} color="white" />
            )}
          </View>
        )}
        label="Login"
        onPress={() => {
          setSearching(true);
          setTimeout(() => {
            setSearching(false);
          }, 1200);
        }}
      />
    );
  };
  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <ConnectionStatusBar
          onConnectionChange={() => console.log('connection changed')}
        />
        <View padding-s4>
          <FormGroup>
            <Text marginB-15>Logged in as {auth.user.login_name}</Text>
            <Text marginB-15>
              Current API endpoint: {Config.MUSHROOM_OBSERVER_API_URL}
            </Text>
            <Text marginB-15>
              Current API key:{' '}
              {`********************${auth.key.substring(
                auth.key.length - 4,
                auth.key.length,
              )}`}
            </Text>
            <Text marginB-15>Version: {DeviceInfo.getVersion()}</Text>
          </FormGroup>
          <FormGroup marginB-s4>
            <Image
              cover
              blurRadius={1}
              source={{
                uri: 'https://images.ctfassets.net/cnu0m8re1exe/2d094asxiXehGCvcx7QnKH/e792b90410266045506464e4c844b6d3/shutterstock_315070247.jpg',
              }}
              overlayType={Image.overlayTypes.SOLID}
            />
            <Text text80M>Login</Text>
            <View flex>
              <TextField
                placeholder={'Email'}
                floatingPlaceholder
                enableErrors
                validate={['required', 'email']}
                validateOnChange
                validationMessage={['Field is required', 'Email is invalid']}
              />
            </View>
            <TextField
              placeholder="Password"
              floatingPlaceholder
              trailingAccessory={<TrailingAccessory />}
            />
          </FormGroup>
          <FormGroup>
            <ProgressBar progress={55} />
            <Text text80M>Coordinates</Text>
            <View row>
              <View flex>
                <TextField
                  text80
                  placeholder="Latitude"
                  floatingPlaceholder
                  floatOnFocus
                />
              </View>
              <View flex>
                <TextField
                  placeholder="Longitude"
                  floatingPlaceholder
                  floatOnFocus
                />
              </View>
              <View flex>
                <TextField
                  value={value}
                  onChangeText={e => {
                    console.log(e);
                    setValue(e);
                  }}
                  placeholder="Altitude"
                  floatingPlaceholder
                  floatOnFocus
                />
              </View>
            </View>
          </FormGroup>
        </View>
      </ScrollView>
    </View>
  );
};

export default DevScreen;
