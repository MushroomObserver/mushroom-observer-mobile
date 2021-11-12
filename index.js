import { name as appName } from './app.json';
import App from './app/index.js';
import { AppRegistry } from 'react-native';

AppRegistry.registerComponent(appName, () => App);
