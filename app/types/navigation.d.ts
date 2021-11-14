import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ForwardedStackScreenProps } from 'react-navigation-props-mapper';

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
  'View Observation': { id: number };
  'Edit Observation': { id: number };
};

type ForwardedViewObservationProps = ForwardedStackScreenProps<
  HomeStackParamList,
  'View Observation'
>;

type ForwardedEditObservationProps = ForwardedStackScreenProps<
  HomeStackParamList,
  'Edit Observation'
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends LoginStackParamList, HomeStackParamList {}
  }
}
