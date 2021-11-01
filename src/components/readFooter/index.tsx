import React from 'react';
import {
  Pressable,
  Center,
  Box,
  HStack,
  HamburgerIcon,
  MoonIcon,
  InfoOutlineIcon,
  useColorMode,
} from 'native-base';
// import {display} from 'styled-system';

// import {store} from '../redux/store';
//@type
import {storeBookMsg} from '../../types/store';
interface Props {
  isOpen: boolean;
  bookMsg: storeBookMsg;
  chapterList: {name: string; uri: string}[]; //章节列表使用
  fontSize: [number, React.Dispatch<React.SetStateAction<number>>];
}
import FooterChapter from '../../containers/footer_chapter';
import FooterFont from './root_font';
const ReadFooter: React.FC<Props> = props => {
  const {colorMode, toggleColorMode} = useColorMode();
  let initSet = colorMode === 'dark' ? new Set([1]) : new Set<number>();
  const [selected, setSelected] = React.useState<Set<number>>(initSet);

  function cancelTarget(target: number) {
    let set = new Set([...selected]);
    set.delete(target);
    setSelected(set);
  }
  function mutexSet(target: number) {
    //互斥添加状态，0状态和2状态:  state(0) & state(2) = 0
    let set;
    if (selected.has(1)) {
      set = new Set([1, target]);
    } else {
      set = new Set([target]);
    }
    setSelected(set);
  }
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
      <HStack
        _light={{bg: 'white'}}
        _dark={{bg: 'dark.200'}}
        alignItems="center">
        <Pressable
          opacity={selected.has(0) ? 1 : 0.5}
          py="3"
          flex={1}
          onPress={() => mutexSet(0)}>
          <Center>
            <HamburgerIcon
              size="6"
              name={selected.has(0) ? 'chapter' : 'chapter-outline'}
            />
          </Center>
        </Pressable>
        <Pressable
          opacity={selected.has(1) ? 1 : 0.5}
          py="2"
          flex={1}
          onPress={() => {
            selected.has(1)
              ? cancelTarget(1)
              : setSelected(new Set([...selected, 1]));
            toggleColorMode();
          }}>
          <Center>
            <MoonIcon size="6" />
          </Center>
        </Pressable>
        <Pressable
          opacity={selected.has(2) ? 1 : 0.6}
          py="2"
          flex={1}
          onPress={() => mutexSet(2)}>
          <Center>
            <InfoOutlineIcon
              size="6"
              name={selected.has(2) ? 'font' : 'font-outline'}
            />
          </Center>
        </Pressable>
      </HStack>
      <FooterChapter
        bookMsg={props.bookMsg}
        onClose={() => cancelTarget(0)}
        isOpen={selected.has(0)}
        chapterList={props.chapterList}
      />
      <FooterFont
        fontSize={props.fontSize}
        isOpen={selected.has(2)}
        onClose={() => cancelTarget(2)}
      />
    </Box>
  );
};
export default ReadFooter;
