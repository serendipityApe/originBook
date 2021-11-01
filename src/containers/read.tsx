import React from 'react';
import {View, Box, Text, Pressable} from 'native-base';
import {Dimensions, StatusBar, UIManager, findNodeHandle} from 'react-native';
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
  chapterList: {name: string; uri: string}[];
  set_shelf: Function;
  edit_book: Function;
}
interface textXYState {
  width: number;
  height: number;
}

interface fontSizeState {
  fontSize: string;
  numberOfLines: number;
  letterSpacing: number;
  lineHeight: number;
}
const Read: React.FC<Props> = props => {
  //切割分页内容
  function splitBook(
    msg: string,
    textXY: textXYState,
    fontState: fontSizeState,
  ) {
    let arr = msg.split('\n\n');

    let deviceX = textXY.width;
    let deviceY = textXY.height;
    let fontSize = Number(fontState.fontSize);
    let lineHeight: number = fontState.lineHeight;
    let letterSpacing: number = fontState.letterSpacing;

    let lineNumber = Math.floor(deviceX / (fontSize + letterSpacing));
    let lines = Math.floor(deviceY / lineHeight - 3);
    var pageLines = 0;
    let page = '';
    let res = [];
    for (let element of arr) {
      let prePageLines = pageLines;
      //首行空两位，但实际上占了4个length，所有反而要-2
      pageLines += Math.ceil((element.length - 2) / lineNumber) + 1;
      if (pageLines < lines) {
        page += element + '\n\n';
      } else if (pageLines === lines) {
        //刚好翻页，无溢出
        page += element + '\n\n';
        // console.log(page);
        res.push(page);
        page = '\n';
        pageLines = 0;
        continue;
      } else if (pageLines > lines) {
        //翻页了，但最后一段溢出
        let surplusLines = lines - prePageLines;
        let surplusFonts = surplusLines * lineNumber + 2;
        page += element.slice(0, surplusFonts + 1);
        res.push(page);
        //新一页的起始行数。
        pageLines = pageLines - lines;
        page = '\n' + element.slice(surplusFonts + 1);
        continue;
      }
    }
    return res;
  }
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
      await RNFS.writeFile(path, contents, encoding);
    } catch (err) {
      console.log(err);
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
  //本章小说切割后
  const [pageBook, setPageBook] = React.useState<string[]>([]);
  //本书信息
  const [book, setBook] = React.useState(getBook(props.name));
  //底部开关
  const [footerIsOpen, setFooterIsOpen] = React.useState(true);
  //当前章节地址
  const [uri, setUri] = React.useState(props.chapterList[book.preChapter].uri);
  //加载ing开关
  const [loading, setLoading] = React.useState(true);
  //当前页数
  const [curPage, setCurPage] = React.useState(0);
  //字体相关
  const [fontState, setFontState] = React.useState<fontSizeState>({
    fontSize: '20',
    numberOfLines: 22,
    letterSpacing: 2,
    lineHeight: 30,
  });
  //Text宽高
  const [textXY, setTextXY] = React.useState<textXYState>({
    width: 320,
    height: 723,
  });
  const web = React.useRef<WebView>(null);
  store.subscribe(() => {
    setBook(getBook(props.name));
    // console.log('变化' + getBook(props.name));
  });
  // React.useEffect(() => {
  //   const handle = findNodeHandle(text.current);
  //   UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
  //     console.log('相对父视图位置x:', x);
  //     console.log('相对父视图位置y:', y);
  //     console.log('组件宽度width:', width);
  //     console.log('组件高度height:', height);
  //     console.log('距离屏幕的绝对位置x:', pageX);
  //     console.log('距离屏幕的绝对位置y:', pageY);
  //     setTextXY({width, height});
  //   });
  // }, []);
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

  useUpdateEffect(() => {
    //切割完成
    setPageBook(splitBook(msg, textXY, fontState));
    setLoading(false);
    setCurPage(0);
  }, [msg]);
  //设备宽度
  const deviceW = Dimensions.get('window').width;
  const text = React.useRef(null);
  return (
    <View>
      <View style={{height: 0, width: 0, display: 'none'}}>
        <WebView
          startInLoadingState={true}
          ref={web}
          source={{uri}}
          injectedJavaScript={jsCode}
          onMessage={event => {
            // console.log(event.nativeEvent.data);
            setMsg(event.nativeEvent.data);
          }}
          onLoadEnd={() => {
            console.log('阅读页面执行完毕');
            web && web.current!.injectJavaScript('window.test()');
          }}
        />
      </View>
      <Pressable
        height="100%"
        paddingX="5"
        paddingTop="0"
        // bg="red.100"
        _dark={{background: 'dark.100'}}
        onPress={e => {
          let x = e.nativeEvent.pageX;
          if (x < deviceW * 0.3) {
            console.log('left');
            if (curPage === 0) {
              props.edit_book({
                name: props.name,
                preChapter: Math.max(0, book.preChapter - 1),
              });
            } else {
              setCurPage(curPage - 1);
            }
            if (footerIsOpen) {
              setFooterIsOpen(false);
            }
          } else if (x < deviceW && x > deviceW * 0.7) {
            if (curPage === pageBook.length - 1) {
              props.edit_book({
                name: props.name,
                preChapter: book.preChapter + 1,
              });
            } else {
              setCurPage(curPage + 1);
            }
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
          _dark={{color: 'muted.500'}}
          ref={text}
          paddingTop="0"
          lineHeight={fontState.lineHeight}
          letterSpacing={fontState.letterSpacing}
          numberOfLines={fontState.numberOfLines}
          fontSize={fontState.fontSize}
          ellipsizeMode="clip"
          textAlign="justify"
          height="96%">
          {pageBook.length === 0 ? msg : pageBook[curPage]}
        </Text>
        <Text
          fontSize="14"
          color="gray.600"
          position="absolute"
          bottom={5}
          right={8}>
          {curPage + 1}/{pageBook.length}
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
