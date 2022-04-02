import React from 'react';
import { Colors, Card, CardProps } from 'react-native-ui-lib';

export const FormGroup = (props: CardProps) => {
  return (
    <Card br20 bg-white padding-s2 {...props}>
      {props.children}
    </Card>
  );
};
