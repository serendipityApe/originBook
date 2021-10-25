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
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  Text,
  HStack,
  Center,
  Heading,
  StatusBar,
  Box,
  View,
  // Stack,
  ScrollView,
  Switch,
  useColorMode,
  NativeBaseProvider,
  VStack,
  Hidden,
  Modal,
  Flex,
  Code,
  AddIcon,
  Button,
} from 'native-base';
import {PermissionsAndroid} from 'react-native';
import {WebView} from 'react-native-webview';

import BlankBook from './src/components/blankBook';
import Search from './src/components/search';
import Book from './src/components/book';
import ReadBook from './src/views/readBook'
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
const Stack = createNativeStackNavigator();
function Home({navigation}) {
  return (
    <Center
      _dark={{bg: 'blueGray.900'}}
      _light={{bg: 'blueGray.50'}}
      px={4}
      flex={1}>
      <StatusBar
        animated={true}
        // translucent={true}
        barStyle="dark-content"
        backgroundColor={'#f8fafc'}
      />
      <Search />
      <ScrollView position="relative" maxHeight="80%">
        <Flex
          direction="row"
          flexWrap="wrap"
          // alignItems="center"
          justifyContent="space-between"
          position="relative">
          <Book />
          <Book />
          <Book />
          <Book />
          <BlankBook />
          <Button onPress={() => navigation.push('Details')}>
            go to details
          </Button>
          <Box
            flexBasis="30%"
            flexShrink="0"
            flexGrow="0"
            width="0"
            height="0"
          />
          {/* <ToggleDarkMode /> */}
        </Flex>
      </ScrollView>
    </Center>
  );
}

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
  // React.useEffect(() => {});
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            //隐藏header bar
            options={{headerShown: false}}
            component={Home}
          />
          <Stack.Screen name="Details" component={ReadBook} />
        </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
};
export default App;
