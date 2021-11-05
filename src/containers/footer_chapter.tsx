import React from 'react';
import {View, Actionsheet, FlatList, Text} from 'native-base';
// import RNFS from 'react-native-fs';
// import {store} from '../redux/store';
//引入action
import {edit_book} from '../redux/actions/bookshelf';
//引入connect用于连接UI组件与redux
import {connect} from 'react-redux';
import {StoreState} from '../types/store';
interface Props {
  isOpen: boolean;
  onClose: Function;
  bookMsg: {
    name: string;
    preChapter: number;
    pUri: string;
  };
  edit_book: Function;
  chapterList: {name: string; uri: string}[];
}
const FooterChapter: React.FC<Props> = props => {
  const [chapterLsit] = React.useState(props.chapterList);
  /*
  //读取文件获取章节,现已改成props获取
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
  }, []); */
  const preChapter = props.bookMsg.preChapter;
  return (
    <View>
      <Actionsheet
        // disableOverlay
        hideDragIndicator
        onClose={() => {
          props.onClose();
        }}
        isOpen={props.isOpen}>
        <Actionsheet.Content>
          <FlatList
            data={chapterLsit}
            //flatList优化
            getItemLayout={(data, index: number) => ({
              length: 53,
              offset: 53 * index,
              index,
            })}
            initialScrollIndex={preChapter}
            renderItem={({item, index}) => (
              <Text
                _dark={{color: 'muted.400'}}
                minWidth="99%"
                padding="4"
                style={index === preChapter ? {color: '#60a5fa'} : {}}
                onPress={() => {
                  //解决本章卡死
                  if (index === preChapter) {
                    props.onClose();
                  } else {
                    props.edit_book({
                      name: props.bookMsg.name,
                      preChapter: index,
                    });
                    props.onClose();
                  }
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
