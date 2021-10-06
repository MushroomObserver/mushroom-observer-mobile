import { Assets } from 'react-native-ui-lib';

export default () => {
  Assets.loadAssetsGroup('icons', {
    logo: require('./logo.png'),
  });
};
