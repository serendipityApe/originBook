import React from 'react';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {
  Menu,
  Divider,
  AddIcon,
  Box,
  Pressable,
  Center,
  NativeBaseProvider,
} from 'native-base';
import {PermissionsAndroid, Linking} from 'react-native';

export function Example() {
  //获取权限
  async function permissions() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: '获取读写权限',
          message: '需要获取读写权限',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: '取消',
          buttonPositive: '同意',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('权限获取到了');
        picker();
      } else {
        console.log('Camera permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  async function picker() {
    // 选择单个文件
    try {
      const res = await DocumentPicker.pick({
        // 文件后缀限定为txt
        type: [DocumentPicker.types.plainText],
      });
      console.log(
        res,
        // res[0].uri,
        // res[0].type, // mime type
        // res[0].name,
        // res[0].size,
      );
      readFile(res[0].uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // 用户取消选取器，退出任何对话框或菜单，然后继续
      } else {
        throw err;
      }
    }
  }
  async function readFile(MyPath: string) {
    try {
      const path = MyPath;
      const contents = await RNFS.readFile(path, 'utf8');
      console.log(contents);
      return '' + contents;
    } catch (e) {
      console.log('' + e);
    }
  }
  function openUriInBrowser(url: string) {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.warn("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', url));
  }
  return (
    <Box position="relative" left="10">
      <Menu
        w="250"
        placement="bottom right"
        closeOnSelect={false}
        onOpen={() => console.log('opened')}
        onClose={() => console.log('closed')}
        trigger={triggerProps => {
          return (
            <Pressable {...triggerProps}>
              <AddIcon size="4" />
            </Pressable>
          );
        }}>
        <Menu.Group title="导入书籍">
          <Menu.Item onPress={permissions}>从本地txt导入</Menu.Item>
          <Menu.Item>输入网址导入</Menu.Item>
        </Menu.Group>
        <Divider mt="3" w="100%" />
        <Menu.Group title="系统设置">
          <Menu.Item>深色模式开发中...</Menu.Item>
          <Menu.Item
            onPress={() => {
              openUriInBrowser(
                'https://www.wolai.com/54qV2w21C6nELHSFCKtFPq?theme=light',
              );
            }}>
            关于originBook
          </Menu.Item>
        </Menu.Group>
      </Menu>
    </Box>
  );
}

export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <Example />
      </Center>
    </NativeBaseProvider>
  );
};
