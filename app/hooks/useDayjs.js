import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useMemo } from 'react';

dayjs.extend(LocalizedFormat);

export const useDayjs = () => {
  return useMemo(() => dayjs, [dayjs]);
};

export default useDayjs;
