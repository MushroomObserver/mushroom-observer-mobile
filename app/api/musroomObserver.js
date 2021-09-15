import Config from 'react-native-config';

const API_URL = Config.MUSHROOM_OBSERVER_API_URL;
const API_KEY = Config.MUSHROOM_OBSERVER_API_KEY;

export const login = async username => {
  const apiKeyResponse = await fetch(
    `${API_URL}/api2/api_keys?api_key=${API_KEY}&for_user=${username}&app=mushroom-observer-mobile&detail=high`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );

  const {
    user,
    results: [{key}],
  } = await apiKeyResponse.json();

  return {
    name: username,
    id: user,
    apiKey: key,
  };
};

export const getObservations = async user => {
  const getObservationsResponse = await fetch(
    `${API_URL}/api2/observations?&api_key=${user.apiKey}&user=${user.name}&detail=high`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );
  const {results} = await getObservationsResponse.json();
  console.log(user.apiKey, results);
  return results;
};

export const createObservation = async params => {};

export default {
  login,
  getObservations,
  createObservation,
};
