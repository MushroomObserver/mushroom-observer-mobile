import React from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import musroomObserver from '../api/musroomObserver';

const UserContext = React.createContext();

export const UserProvider = props => {
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    async function loadStoredUser() {
      try {
        const storedUser = await JSON.parse(
          await EncryptedStorage.getItem('User'),
        );
        setUser(storedUser);
      } catch (error) {
        console.log('load user error', error);
      }
    }
    loadStoredUser();
  }, []);

  const login = async name => {
    try {
      const newUser = await musroomObserver.login(name);
      await EncryptedStorage.setItem('User', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('login error', error);
    }
  };

  const logout = async () => {
    try {
      await EncryptedStorage.clear();
      setUser(undefined);
    } catch (error) {
      console.error('logout error', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
      }}>
      {props.children}
    </UserContext.Provider>
  );
};

export const UserConsumer = UserContext.Consumer;

export default UserContext;
