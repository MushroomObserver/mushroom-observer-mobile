import React, { ReactChild, ReactNode } from 'react';
import { Colors } from 'react-native-ui-lib';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  HeaderButtons,
  HeaderButton,
  HeaderItemProps,
} from 'react-navigation-header-buttons';

const IoniconsHeaderButton = (props: HeaderItemProps) => (
  <HeaderButton
    IconComponent={Ionicons}
    iconSize={23}
    color={props.disabled ? 'grey' : props.color}
    {...props}
  />
);

export default ({ children }: { children: ReactChild | ReactNode[] }) => (
  <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
    {children}
  </HeaderButtons>
);
