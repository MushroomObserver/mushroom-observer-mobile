import { selectCurrentUser, selectIsLogout, selectKey } from '../store/auth';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const key = useSelector(selectKey);
  const isLogout = useSelector(selectIsLogout);
  return useMemo(() => ({ user, key, isLogout }), [user, key, isLogout]);
};

export const useKey = () => {
  const key = useSelector(selectKey);
  return useMemo(() => key, [key]);
};

export const useUser = () => {
  const user = useSelector(selectCurrentUser);
  return useMemo(() => user, [user]);
};

export const useIsLogout = () => {
  const user = useSelector(selectIsLogout);
  return useMemo(() => user, [user]);
};

export default { useAuth, useKey, useUser, useIsLogout };
