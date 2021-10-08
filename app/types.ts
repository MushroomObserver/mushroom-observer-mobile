import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type LoginStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<
  LoginStackParamList,
  'Login'
>;
export type RegisterScreenProps = NativeStackScreenProps<
  LoginStackParamList,
  'Register'
>;

export type HomeTabParamList = {
  'My Observations': undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  Home: NavigatorScreenParams<HomeTabParamList>;
  'Name and Photos': undefined;
  'Time and Location': undefined;
  'Select Location': undefined;
  'Identification and Notes': undefined;
  'Edit Photo': undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends LoginStackParamList, HomeStackParamList {}
  }
}

export interface Observation {
  id: number;
  name: string;
  date: string;
  gpsHidden: boolean;
  isCollectionLocation: boolean;
  location: number;
  latitude: number;
  longitude: number;
  altitude: number;
  notes: string;
  vote: number;
  isUploaded: boolean;
  hasChanges: boolean;
}

export interface Image {
  id: number;
  copyrightHolder: string;
  date: string;
  license: number;
  notes: string;
}
