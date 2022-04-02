import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, ViewProps } from 'react-native-ui-lib';

export const ScreenLayout = ({ children }: ViewProps) => {
  return <View>{children}</View>;
};
export default ScreenLayout;
