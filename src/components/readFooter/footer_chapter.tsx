import React from 'react';
import {View, Text, Actionsheet, FlatList} from 'native-base';
import RNFS from 'react-native-fs';
// import {store} from '../redux/store';

interface Props {
  selected: number;
  setSelected: Function;
  bookMsg: {
    name: string;
    preChapter: number;
    pUri: string;
  };
}
const FooterChapter: React.FC<Props> = props => {
  const [chapterLsit, setChapterList] = React.useState([]);
  //根据名字获取书籍目录
  function getPath(name: string) {
    return RNFS.CachesDirectoryPath + '/myBook' + `/${name}`;
  }
  //获取本书的章节列表
  async function getChapterList(name: string) {
    let path = getPath(name) + '/a.txt';
    let data = await RNFS.readFile(path, 'utf8');
    console.log(data);
    setChapterList(JSON.parse(data));
  }
  React.useEffect(() => {
    getChapterList(props.bookMsg.name);
  }, []);
  return (
    <View>
      <Actionsheet
        // disableOverlay
        hideDragIndicator
        onClose={() => {
          props.setSelected(4);
        }}
        isOpen={props.selected === 0}>
        <Actionsheet.Content>
          <FlatList
            data={chapterLsit}
            renderItem={({item}) => (
              <Actionsheet.Item>{item.name}</Actionsheet.Item>
            )}
            keyExtractor={item => item.uri}
          />
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};
export default FooterChapter;
