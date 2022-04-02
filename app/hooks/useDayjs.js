import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(LocalizedFormat);

export const useDayjs = () => {
  return dayjs;
};

export default useDayjs;
