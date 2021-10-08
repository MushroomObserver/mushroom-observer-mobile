import { ThemeManager } from 'react-native-ui-lib';

export default () => {
  ThemeManager.setComponentTheme('Card', {
    borderRadius: 8,
    activeOpacity: 0.9,
  });

  ThemeManager.setComponentTheme('Image', (props, context) => {
    if (props.logo) {
      return {
        resizeMode: 'contain',
        assetName: 'logo',
        width: '100%',
        height: 225,
      };
    }
  });
};
