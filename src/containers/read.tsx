import React from 'react';
import {View, Box, Text, Pressable} from 'native-base';
import {Dimensions, StatusBar} from 'react-native';
import {WebView} from 'react-native-webview';
import RNFS from 'react-native-fs';

//引入action
import {set_shelf, edit_book} from '../redux/actions/bookshelf';
//引入connect用于连接UI组件与redux
import {connect} from 'react-redux';
import {StoreState} from '../types/store';
import {store} from '../redux/store';

import Loading from '../components/loading';
import ReadFooter from '../components/readFooter';
interface Props {
  name: string;
  chapterList: {}[];
  set_shelf: Function;
  edit_book: Function;
}
const Read: React.FC<Props> = props => {
  //目录不存在则添加目录
  async function myMkdir(path: string) {
    try {
      let isExists = await RNFS.exists(path);
      if (!isExists) {
        RNFS.mkdir(path);
      }
    } catch (err) {
      console.log(err);
    }
  }
  //将解析后的书籍内容写入缓存
  async function write(
    LastDirectory: string,
    name: string,
    contents: string,
    encoding: string,
  ) {
    try {
      let path = RNFS.CachesDirectoryPath + '/myBook' + `/${LastDirectory}`;
      await myMkdir(path);
      path += `/${name}.txt`;
      let data = await RNFS.writeFile(path, contents, encoding);
      console.log('path=' + path);
    } catch (err) {
      console.log(err);
    }
  }
  //解析目的地址传来的msg
  function analysis(contents: string): string[] {
    let index = contents.indexOf('&');
    let res = [];
    res.push(contents.slice(0, index).replace('&', ''));
    res.push(contents.slice(index + 1));
    return res;
  }
  //将不存在的书加入书架
  function addBookshelf(name: string) {
    let books = store.getState().bookshelf.contents;
    let flag = true;
    for (let item of books) {
      if (item.name === name) {
        flag = false;
        break;
      }
    }
    if (flag) {
      props.set_shelf({name, pUri: '', preChapter: 0});
    }
  }
  //根据名字获取书籍目录
  function getPath(name: string) {
    return RNFS.CachesDirectoryPath + '/myBook' + `/${name}`;
  }
  //获取store里本书的信息
  function getBook(name: string) {
    let books = store.getState().bookshelf.contents;
    for (let item of books) {
      if (item.name === name) {
        return item;
      }
    }
  }
  //获取本书的章节列表
  async function getChapterList(name: string) {
    let path = getPath(name) + '/a.txt';
    let data = await RNFS.readFile(path, 'utf8');
    // console.log(data);
    // setChapterList(JSON.parse(data));
    return JSON.parse(data);
  }
  const jsCode = `
    window.test = function(){
      let content=document.querySelector('#content');
      while(content.firstElementChild.nodeName != 'BR'){
        content.removeChild(content.firstElementChild)
        }
      window.ReactNativeWebView.postMessage(content.innerText);
    }
    `;

  //本章小说内容
  const [msg, setMsg] = React.useState('');
  const [book, setBook] = React.useState(getBook(props.name));
  const [footerIsOpen, setFooterIsOpen] = React.useState(true);
  const [uri, setUri] = React.useState(props.chapterList[book.preChapter].uri);
  const [loading, setLoading] = React.useState(true);
  const web = React.useRef<WebView>(null);
  store.subscribe(() => {
    setBook(getBook(props.name));
    // console.log('变化' + getBook(props.name));
  });

  //func:当对应state更新时执行函数  listener:监听的state  ...args:func的参数
  function useUpdateEffect(func: Function, listener: any[], ...args: any[]) {
    let isInitialMount = React.useRef(true);
    React.useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        func.apply(undefined, args);
      }
    }, listener);
  }
  useUpdateEffect(() => {
    setUri(props.chapterList[book.preChapter].uri);
    setLoading(true);
  }, [book]);
  //设备宽度
  const deviceW = Dimensions.get('window').width;
  return (
    <View>
      <View style={{height: 0, width: 0, display: 'none'}}>
        <WebView
          startInLoadingState={true}
          ref={web}
          source={{uri}}
          injectedJavaScript={jsCode}
          onMessage={event => {
            setMsg(event.nativeEvent.data);
          }}
          onLoadEnd={() => {
            console.log('阅读页面执行完毕');
            setLoading(false);
            web && web.current!.injectJavaScript('window.test()');
          }}
        />
      </View>
      <Pressable
        height="100%"
        paddingX="5"
        paddingTop="0"
        // bg="red.100"
        onPress={e => {
          let x = e.nativeEvent.pageX;
          if (x < deviceW * 0.3) {
            console.log('left');
            if (footerIsOpen) {
              setFooterIsOpen(false);
            }
          } else if (x < deviceW && x > deviceW * 0.7) {
            // props.edit_book({
            //   name: props.name,
            //   preChapter: book.preChapter + 1,
            // });
            if (footerIsOpen) {
              setFooterIsOpen(false);
            }
          } else {
            //console.log('center');
            setFooterIsOpen(!footerIsOpen);
          }
        }}>
        <Text fontSize="12" color="gray.600" paddingTop="2">
          {props.chapterList[book.preChapter].name}
        </Text>
        <Text
          paddingTop="0"
          lineHeight={30}
          letterSpacing="2xl"
          numberOfLines={22}
          ellipsizeMode="clip"
          fontSize="20"
          textAlign="justify"
          height="96%">
          {msg}
        </Text>
      </Pressable>
      <Loading isOpen={loading} />
      <ReadFooter bookMsg={getBook(props.name)} isOpen={footerIsOpen} />
    </View>
  );
};
export default connect(
  (state: StoreState) => {
    // console.log(state);
    return {};
  },
  {set_shelf, edit_book},
)(Read);
