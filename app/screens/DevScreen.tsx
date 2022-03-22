import DraftPhoto from '../components/DraftPhoto';
import NoPhoto from '../components/NoPhoto';
import { FormGroup } from '../components/base/FormGroup';
import { TextField } from '../components/base/TextField';
import HeaderButtons from '../components/header/HeaderButtons';
import { useAuth } from '../hooks/useAuth';
import useDayjs from '../hooks/useDayjs';
import { useNavigation } from '@react-navigation/core';
import { get } from 'lodash';
import React, { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import {
  Button,
  Card,
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
  const dayjs = useDayjs();

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
          <Card
            flex
            row
            marginV-5
            borderRadius={10}
            enableShadow
            onPress={() => {}}
          >
            <View flex flexG padding-7 height={90}>
              <Text text70B0>Draft #1</Text>
              <Text text80BO numberOfLines={1} ellipsizeMode="tail">
                Fungi
              </Text>
              <Text text90L numberOfLines={1} ellipsizeMode="tail">
                Fayetteville, Arkansas, USA
              </Text>
              <Text text100L>{dayjs().format('ll')}</Text>
            </View>
            <NoPhoto
              width={110}
              height={90}
              borderTopRightRadius={10}
              borderBottomRightRadius={10}
            />
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

export default DevScreen;
