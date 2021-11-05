/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import {store, persistor} from './src/redux/store';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {stackParamsList} from './src/types/navigate';
import {
  Text,
  HStack,
  Switch,
  useColorMode,
  NativeBaseProvider,
} from 'native-base';
import {PermissionsAndroid} from 'react-native';

import Home from './src/views/home';
import ReadBook from './src/views/readBook';
import JustWeb from './src/views/justWeb';
// Color Switch Component
function ToggleDarkMode() {
  const {colorMode, toggleColorMode} = useColorMode();
  return (
    <HStack space={2} alignItems="center">
      <Text>Dark</Text>
      <Switch
        isChecked={colorMode === 'light' ? true : false}
        onToggle={toggleColorMode}
        aria-label={
          colorMode === 'light' ? 'switch to dark mode' : 'switch to light mode'
        }
      />
      <Text>Light</Text>
    </HStack>
  );
}
const Stack = createNativeStackNavigator<stackParamsList>();

const App = () => {
  async function permissions() {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ];
      //返回得是对象类型
      const granteds = await PermissionsAndroid.requestMultiple(permissions);
      var data = '是否同意地址权限: ';
      if (granteds['android.permission.ACCESS_FINE_LOCATION'] === 'granted') {
        data = data + '是\n';
      } else {
        data = data + '否\n';
      }
      data = data + '是否同意读取权限: ';
      if (granteds['android.permission.READ_EXTERNAL_STORAGE'] === 'granted') {
        data = data + '是\n';
      } else {
        data = data + '否\n';
      }
      data = data + '是否同意相机权限: ';
      if (granteds['android.permission.CAMERA'] === 'granted') {
        data = data + '是\n';
      } else {
        data = data + '否\n';
      }
      data = data + '是否同意存储权限: ';
      if (granteds['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
        data = data + '是\n';
      } else {
        data = data + '否\n';
      }
      console.log(data);
    } catch (err) {
      console.log(err.toString());
    }
  }
  function checkPermission() {
    try {
      //返回Promise类型
      const granted = PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      granted
        .then(data => {
          console.log(data + '权限');
        })
        .catch(err => {
          console.log(err.toString());
        });
    } catch (err) {
      console.log(err.toString());
    }
  }
  React.useEffect(() => {
    permissions();
  });
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                //隐藏header bar
                options={{headerShown: false}}
                component={Home}
              />
              <Stack.Screen
                name="Details"
                options={{headerShown: false}}
                component={ReadBook}
              />
              <Stack.Screen
                name="JustWeb"
                options={{headerShown: false}}
                component={JustWeb}
              />
            </Stack.Navigator>
          </PersistGate>
        </Provider>
      </NativeBaseProvider>
    </NavigationContainer>
  );
};
export default App;
