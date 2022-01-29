import useDayjs from '../hooks/useDayjs';
import React from 'react';
import { Text } from 'react-native-ui-lib';

export const DateView = ({
  date,
  format,
}: {
  date: string | Date;
  format: string;
}) => {
  const dayjs = useDayjs();
  if (date) {
    return <Text>{dayjs(date).format(format)}</Text>;
  }
  return null;
};
