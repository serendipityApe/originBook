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
import {Center, StatusBar, Box, ScrollView, Flex, Button} from 'native-base';

import {store} from '../redux/store';
import BlankBook from '../components/blankBook';
import Search from '../components/search';
import Book from '../components/book';
function Home({navigation}) {
  // const books = store.getState().bookshelf.contents;
  const [books, setBooks] = React.useState(store.getState().bookshelf.contents);
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
              />
            );
          })}
          <Book name="test" pUri="" />
          <Book name="test" pUri="" />
          <Book name="test" pUri="" />
          <Book name="test" pUri="" />
          <BlankBook />
          <Button onPress={() => navigation.push('Details')}>go</Button>
          <Button
            onPress={() => {
              console.log(store.getState().bookshelf);
            }}>
            store
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

export default Home;
