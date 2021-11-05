import React from 'react';
import {
  Center,
  Switch,
  Text,
  HStack,
  StatusBar,
  Box,
  ScrollView,
  Flex,
  Button,
  useColorMode,
  Modal,
} from 'native-base';
import Clipboard from '@react-native-clipboard/clipboard';

import {store} from '../redux/store';
import BlankBook from '../components/blankBook';
import Search from '../components/search';
import Book from '../components/book';

//type
import {navigationProp} from '../types/navigate';
import {storeBookMsg} from '../types/store';
interface Props {
  navigation: navigationProp;
}

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
const Home: React.FC<Props> = ({navigation}) => {
  const [books, setBooks] = React.useState<storeBookMsg[]>(
    store.getState().bookshelf.contents,
  );
  const [showModal, setShowModal] = React.useState(false);
  store.subscribe(() => {
    setBooks(store.getState().bookshelf.contents);
  });
  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    navigation.navigate('Details', {
      uri: text,
    });
  };
  return (
    <Center
      paddingTop={6}
      _dark={{bg: 'blueGray.900'}}
      _light={{bg: 'blueGray.50'}}
      px={4}
      flex={1}>
      <StatusBar
        animated={true}
        translucent={true}
        barStyle="dark-content"
        backgroundColor={'transparent'}
      />
      <Search />
      <ScrollView position="relative" top={2} maxHeight="80%">
        <Flex
          direction="row"
          flexWrap="wrap"
          // alignItems="center"
          justifyContent="space-between"
          position="relative">
          {books.map(element => {
            return (
              <Book
                name={element.name}
                key={element.name}
                pUri={element.pUri}
                onPress={(uri: string) => {
                  navigation.navigate('Details', {
                    uri,
                  });
                }}
              />
            );
          })}
          <BlankBook
            onPress={() => {
              setShowModal(true);
            }}
          />
          <Box
            flexBasis="30%"
            flexShrink={0}
            flexGrow={0}
            width="0"
            height="0"
          />
          {/* <Button
            onPress={() => {
              console.log(store.getState().bookshelf.contents);
            }}>
            store
          </Button> */}
          {/* <ToggleDarkMode /> */}
        </Flex>
      </ScrollView>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>提示</Modal.Header>
          <Modal.Body>
            <Text>目前仅支持通过网址导入小说，此操作将调用您的粘贴板</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}>
                取消
              </Button>
              <Button
                onPress={() => {
                  setShowModal(false);
                  fetchCopiedText();
                }}>
                确认
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default Home;
