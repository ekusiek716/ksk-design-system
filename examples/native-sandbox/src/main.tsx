import { AppRegistry } from 'react-native';
import App from './App';

// react-native-web の標準起動。AppRegistry がスタイルリセット等を注入する。
AppRegistry.registerComponent('KskDsSandbox', () => App);
AppRegistry.runApplication('KskDsSandbox', {
  rootTag: document.getElementById('root'),
});
