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
} from 'native-base';

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
  store.subscribe(() => {
    setBooks(store.getState().bookshelf.contents);
  });
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
          <BlankBook />
          {/* <Button onPress={() => navigation.push('Details')}>go</Button> */}
          <Button
            onPress={() => {
              console.log(store.getState().bookshelf);
            }}>
            store
          </Button>
          <Box
            flexBasis="30%"
            flexShrink={0}
            flexGrow={0}
            width="0"
            height="0"
          />
          <ToggleDarkMode />
        </Flex>
      </ScrollView>
    </Center>
  );
};

export default Home;
