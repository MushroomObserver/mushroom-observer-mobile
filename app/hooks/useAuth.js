import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {selectCurrentUser, selectKey} from '../services/auth';

export const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const key = useSelector(selectKey);
  return useMemo(() => ({user, key}), [user, key]);
};

export const useKey = () => {
  const key = useSelector(selectKey);
  return useMemo(() => key, [key]);
};

export const useUser = () => {
  const user = useSelector(selectCurrentUser);
  return useMemo(() => user, [user]);
};
export default {useAuth, useKey, useUser};
