import React, { forwardRef } from 'react';
import { Incubator } from 'react-native-ui-lib';

export const TextField = forwardRef((props: Incubator.TextFieldProps, ref) => {
  return <Incubator.TextField ref={ref} {...props} />;
});
