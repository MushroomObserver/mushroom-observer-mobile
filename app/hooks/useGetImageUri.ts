import Config from 'react-native-config';

const getImageUri = (uri: string) => {
  return __DEV__
    ? uri?.replace(
        'http://images.mushroomobserver.org',
        Config.MUSHROOM_OBSERVER_API_URL + '/images',
      )
    : uri;
};

export default getImageUri;
