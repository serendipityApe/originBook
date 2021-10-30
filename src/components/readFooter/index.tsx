import React from 'react';
import {
  View,
  Pressable,
  Center,
  Box,
  Icon,
  Button,
  HStack,
  HamburgerIcon,
  MoonIcon,
  InfoOutlineIcon,
} from 'native-base';
import {display} from 'styled-system';

// import {store} from '../redux/store';

interface Props {
  isOpen: boolean;
  bookMsg: {};
}
import FooterChapter from '../../containers/footer_chapter';
const ReadFooter: React.FC<Props> = props => {
  const [selected, setSelected] = React.useState(2);
  return (
    <Box
      position="absolute"
      bottom="0"
      width="100%"
      style={
        props.isOpen
          ? {display: 'flex'}
          : {display: 'none', position: 'relative'}
      }
      height="6%">
      <HStack bg="white" alignItems="center">
        <Pressable
          opacity={selected === 0 ? 1 : 0.5}
          py="3"
          flex={1}
          onPress={() => setSelected(0)}>
          <Center>
            <HamburgerIcon
              size="6"
              name={selected === 0 ? 'chapter' : 'chapter-outline'}
            />
          </Center>
        </Pressable>
        <Pressable
          opacity={selected === 1 ? 1 : 0.5}
          py="2"
          flex={1}
          onPress={() => setSelected(1)}>
          <Center>
            <MoonIcon size="6" />
          </Center>
        </Pressable>
        <Pressable
          opacity={selected === 2 ? 1 : 0.6}
          py="2"
          flex={1}
          onPress={() => setSelected(2)}>
          <Center>
            <InfoOutlineIcon
              size="6"
              name={selected === 2 ? 'font' : 'font-outline'}
            />
          </Center>
        </Pressable>
      </HStack>
      <FooterChapter
        bookMsg={props.bookMsg}
        setSelected={setSelected}
        selected={selected}
      />
      {/* <Box
        flex={1}
        bg="white"
        safeAreaTop
        position="relative"
        bottom="0"
        top="10">
        <Center flex={1} />
        <HStack bg="white" alignItems="center" safeAreaBottom shadow={6}>
          <Pressable
            opacity={selected === 0 ? 1 : 0.5}
            py="3"
            flex={1}
            // onPress={() => setSelected(0)}>
            onPress={() => {
              console.log('11111');
            }}>
            <Center>
              <HamburgerIcon
                size="6"
                name={selected === 0 ? 'chapter' : 'chapter-outline'}
              />
            </Center>
          </Pressable>
          <Pressable
            opacity={selected === 1 ? 1 : 0.5}
            py="2"
            flex={1}
            onPress={() => setSelected(1)}>
            <Center>
              <MoonIcon size="6" />
            </Center>
          </Pressable>
          <Pressable
            opacity={selected === 2 ? 1 : 0.6}
            py="2"
            flex={1}
            onPress={() => setSelected(2)}>
            <Center>
              <InfoOutlineIcon
                size="6"
                name={selected === 2 ? 'font' : 'font-outline'}
              />
            </Center>
          </Pressable>
        </HStack>
      </Box> */}
    </Box>
  );
};
export default ReadFooter;
