import Config from 'react-native-config';

const API_URL = 'https://maps.googleapis.com/maps/api';
const API_KEY = Config.GOOGLE_MAPS_API_KEY;

export const getElevation = async (latitude, longitude) => {
  const elevationResponse = await fetch(
    `${API_URL}/elevation/json?key=${API_KEY}&locations=${encodeURIComponent(
      `${latitude},${longitude}`,
    )}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );

  const {
    results: [{elevation}],
  } = await elevationResponse.json();

  return elevation;
};

export const getGeocode = async location => {
  const geocodeResponse = await fetch(
    `${API_URL}/geocode/json?key=${API_KEY}&address=${encodeURIComponent(
      location,
    )}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );
  const {
    results: [
      {
        geometry: {
          location: {lat, lng},
        },
      },
    ],
  } = await geocodeResponse.json();
  return {latitude: lat, longitude: lng};
};

export default {
  getElevation,
  getGeocode,
};
