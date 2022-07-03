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
  'My Drafts': undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  Home: NavigatorScreenParams<HomeTabParamList>;
  'Create Draft': { id: string };
  'Edit Draft': { id: string };
  'Select Location': { id: string };
  'View Observation': { id: string };
  'Edit Observation': { id: string };
  'Create Photo': { id: string };
  'View Photo': { id: string };
  'Edit Photo': { id: string };
};

type ForwardedCreateDraftProps = ForwardedStackScreenProps<
  HomeStackParamList,
  'Create Draft'
>;

type ForwardedViewObservationProps = ForwardedStackScreenProps<
  HomeStackParamList,
  'View Observation'
>;

type ForwardedEditObservationProps = ForwardedStackScreenProps<
  HomeStackParamList,
  'Edit Observation'
>;

type ForwardedCreatePhotoProps = ForwardedStackScreenProps<
  HomeStackParamList,
  'Create Photo'
>;

type ForwardedViewPhotoProps = ForwardedStackScreenProps<
  HomeStackParamList,
  'View Photo'
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends LoginStackParamList, HomeStackParamList {}
  }
}
