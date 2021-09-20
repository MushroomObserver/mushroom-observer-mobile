import React from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import musroomObserver from '../api/musroomObserver';

const UserContext = React.createContext();

export const UserProvider = props => {
  const [loadingUser, setLoadingUser] = React.useState(true);
  const [working, setWorking] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    async function loadStoredUser() {
      setLoadingUser(true);
      try {
        const storedUser = await JSON.parse(
          await EncryptedStorage.getItem('User'),
        );
        setUser(storedUser);
      } catch (error) {
        console.log('load user error', error);
      }
      setLoadingUser(false);
    }
    loadStoredUser();
  }, []);

  const login = async (name, password) => {
    try {
      setWorking(true);
      const newUser = await musroomObserver.login(name, password);
      await EncryptedStorage.setItem('User', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('login error', error);
    }
    setWorking(false);
  };

  const logout = async () => {
    try {
      setWorking(true);
      await EncryptedStorage.clear();
      setUser(undefined);
    } catch (error) {
      console.error('logout error', error);
    }
    setWorking(false);
  };

  return (
    <UserContext.Provider
      value={{
        loadingUser,
        user,
        login,
        logout,
        working,
      }}>
      {props.children}
    </UserContext.Provider>
  );
};

export const UserConsumer = UserContext.Consumer;

export default UserContext;
