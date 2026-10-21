/**
 * @format
 */

import { AppRegistry, Text, TextInput } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { appFont } from './src/theme/fonts';

const mergeTextDefaultStyle = (defaultStyle) => {
  const nextStyle = Array.isArray(defaultStyle) ? defaultStyle : defaultStyle ? [defaultStyle] : [];
  return [{ fontFamily: appFont }, ...nextStyle];
};

// Установка Lilex по умолчанию для всех компонентов Text в приложении
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = mergeTextDefaultStyle(Text.defaultProps.style);

// Установка Lilex по умолчанию для всех компонентов TextInput
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.style = mergeTextDefaultStyle(TextInput.defaultProps.style);

AppRegistry.registerComponent(appName, () => App);