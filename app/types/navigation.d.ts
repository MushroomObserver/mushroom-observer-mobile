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
  'Name and Photos': { id: string };
  'Time and Location': { id: string, params: object };
  'Select Location': { id: string };
  'Identification and Notes': { id: string };
  'View Observation': { id: string };
  'Edit Observation': { id: string };
  'Create Photo': { id: string };
  'View Photo': { id: string };
  'Edit Photo': { id: string };
};
type ForwardedNameAndPhotosProps = ForwardedStackScreenProps<
  HomeStackParamList,
  'Name and Photos'
>;

type ForwardedTimeAndLocationProps = ForwardedStackScreenProps<
  HomeStackParamList,
  'Time and Location'
>;

type ForwardedSelectLocationProps = ForwardedStackScreenProps<
  HomeStackParamList,
  'Select Location'
>;

type ForwardedIdentificationAndNotesProps = ForwardedStackScreenProps<
  HomeStackParamList,
  'Identification and Notes'
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

type ForwardedEditPhotoProps = ForwardedStackScreenProps<
  HomeStackParamList,
  'Edit Photo'
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends LoginStackParamList, HomeStackParamList {}
  }
}
