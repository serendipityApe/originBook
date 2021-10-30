import React from 'react';
import {View, Actionsheet, FlatList, Text} from 'native-base';
import RNFS from 'react-native-fs';
// import {store} from '../redux/store';
//引入action
import {edit_book} from '../redux/actions/bookshelf';
//引入connect用于连接UI组件与redux
import {connect} from 'react-redux';
import {StoreState} from '../types/store';
import {store} from '../redux/store';
interface Props {
  selected: number;
  setSelected: Function;
  bookMsg: {
    name: string;
    preChapter: number;
    pUri: string;
  };
  edit_book: Function;
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
    setChapterList(JSON.parse(data));
  }
  React.useEffect(() => {
    getChapterList(props.bookMsg.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            renderItem={({item, index}) => (
              <Text
                minWidth="99%"
                padding="4"
                style={
                  index === props.bookMsg.preChapter ? {color: '#60a5fa'} : {}
                }
                onPress={() => {
                  props.edit_book({
                    name: props.bookMsg.name,
                    preChapter: index,
                  });
                  props.setSelected(4);
                }}>
                {item.name}
              </Text>
            )}
            keyExtractor={item => item.uri}
          />
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};
export default connect(
  (state: StoreState) => {
    console.log(state);
    return {};
  },
  {edit_book},
)(FooterChapter);