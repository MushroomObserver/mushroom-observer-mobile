import FlashView from './components/FlashView';
import { useIsLogout, useUser } from './hooks/useAuth';
import CreateDraft from './screens/CreateDraft';
import CreatePhoto from './screens/CreatePhoto';
import DevScreen from './screens/DevScreen';
import EditObservation from './screens/EditObservation';
import ListDrafts from './screens/ListDrafts';
import ListObservations from './screens/ListObservations';
import Login from './screens/Login';
import Register from './screens/Register';
import Settings from './screens/Settings';
import ViewObservation from './screens/ViewObservation';
import ViewPhoto from './screens/ViewPhoto';
import { selectTotal as selectDraftObservationTotal } from './store/draftObservations';
import { selectError, selectInfo, selectWarning } from './store/flash';
import { preloadLocations } from './store/locations';
import { preloadNames } from './store/names';
import { LoginStackParamList } from './types/navigation';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { OverflowMenuProvider } from 'react-navigation-header-buttons';
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';

const { Navigator: LoginStackNavigator, Screen: LoginStackScreen } =
  createNativeStackNavigator<LoginStackParamList>();
const {
  Navigator: HomeStackNavigator,
  Group: HomeStackGroup,
  Screen: HomeStackScreen,
} = createNativeStackNavigator();
const { Navigator: HomeTabsNavigator, Screen: HomeTabsScreen } =
  createBottomTabNavigator();

const LoginStack = () => {
  const isLogout = useIsLogout();
  return (
    <LoginStackNavigator>
      <LoginStackScreen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          animationTypeForReplace: isLogout ? 'pop' : 'push',
        }}
      />
      <LoginStackScreen
        name="Register"
        component={Register}
        options={{
          title: 'Register',
        }}
      />
    </LoginStackNavigator>
  );
};

const HomeTabs = ({ draftObservationCount }: PropsFromRedux) => (
  <HomeTabsNavigator initialRouteName="My Drafts">
    <HomeTabsScreen
      name="My Observations"
      component={ListObservations}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="list-alt" size={size} color={color} />
        ),
      }}
    />
    <HomeTabsScreen
      name="My Drafts"
      component={ListDrafts}
      options={{
        tabBarBadge:
          draftObservationCount > 0 ? draftObservationCount : undefined,
        tabBarIcon: ({ color, size }) => (
          <Icon name="clipboard-list" size={size} color={color} />
        ),
      }}
    />
    <HomeTabsScreen
      name="Settings"
      component={Settings}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="cog" size={size} color={color} />
        ),
      }}
    />
    {__DEV__ && (
      <HomeTabsScreen
        name="Developer"
        component={DevScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="blender-phone" size={size} color={color} />
          ),
        }}
      />
    )}
  </HomeTabsNavigator>
);

const mapStateToProps = (state: any, ownProps: any) => ({
  draftObservationCount: selectDraftObservationTotal(state),
});

const connector = connect(mapStateToProps);

const ConnectedHomeTabs = connector(HomeTabs);

type PropsFromRedux = ConnectedProps<typeof connector>;

const HomeStack = () => (
  <HomeStackNavigator>
    <HomeStackScreen
      name="Home"
      component={ConnectedHomeTabs}
      options={{ headerShown: false }}
    />
    <HomeStackScreen
      name="Create Draft"
      component={CreateDraft}
      options={{ presentation: 'card' }}
    />
    <HomeStackScreen
      name="Edit Draft"
      component={CreateDraft}
      options={{ presentation: 'card' }}
    />
    <HomeStackScreen name="View Observation" component={ViewObservation} />
    <HomeStackScreen name="Edit Observation" component={EditObservation} />
    <HomeStackScreen name="Create Photo" component={CreatePhoto} />
    <HomeStackScreen name="View Photo" component={ViewPhoto} />
  </HomeStackNavigator>
);

const App = () => {
  const user = useUser();
  const dispatch = useDispatch();
  const navigationRef = useNavigationContainerRef();
  const error = useSelector(selectError);
  const warning = useSelector(selectWarning);
  const info = useSelector(selectInfo);

  useReduxDevToolsExtension(navigationRef);

  useEffect(() => {
    dispatch(preloadNames(undefined));
    dispatch(preloadLocations(undefined));
  });

  return (
    <SafeAreaProvider>
      <View flex>
        <FlashView info={info} />
        <FlashView warning={warning} />
        <FlashView error={error} />
        <NavigationContainer ref={navigationRef}>
          <OverflowMenuProvider>
            {!user ? <LoginStack /> : <HomeStack />}
          </OverflowMenuProvider>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
};

export default connectActionSheet(App);
