import React, { ReactChild, ReactNode } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { OverflowMenu } from 'react-navigation-header-buttons';

export default ({ children }: { children: ReactChild | ReactNode[] }) => (
  <OverflowMenu
    style={{ marginLeft: 10 }}
    OverflowIcon={({ color }) => (
      <Ionicons name="ellipsis-vertical" size={23} color={color} />
    )}
  >
    {children}
  </OverflowMenu>
);
