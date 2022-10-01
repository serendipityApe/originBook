import React from 'react';
import {View, Box, Text, Pressable} from 'native-base';
import {Dimensions, StatusBar, StatusBarManager, Platform} from 'react-native';
import {WebView} from 'react-native-webview';
//引入action
import {set_shelf, edit_book} from '../redux/actions/bookshelf';
//引入connect用于连接UI组件与redux
import {connect} from 'react-redux';
import {StoreState} from '../types/store';
import {store} from '../redux/store';

import {getContentCode} from '../utils/grab';

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
  fontSize: number;
  numberOfLines: number;
  letterSpacing: number;
  lineHeight: number;
}
const Read: React.FC<Props> = props => {
  //切割网址
  function splitUri(uri: string) {
    return uri.split('/')[2];
  }
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
      //首行空两位，但实际上占了4个length，所以反而要-2
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
  //获取store里本书的信息
  function getBook(name: string) {
    let books = store.getState().bookshelf.contents;
    for (let item of books) {
      if (item.name === name) {
        return item;
      }
    }
  }

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
  //fontSize
  const [fontSize, setFontSize] = React.useState(20);
  //Text宽高
  const [textXY, setTextXY] = React.useState<textXYState>({
    width: 0,
    height: 0,
  });
  //字体相关
  const [fontState, setFontState] = React.useState<fontSizeState>({
    fontSize,
    numberOfLines: 40,
    letterSpacing: 2,
    lineHeight: fontSize + 10,
  });
  const web = React.useRef<WebView>(null);
  store.subscribe(() => {
    setBook(getBook(props.name));
    // console.log('变化' + getBook(props.name));
  });
  const jsCode = getContentCode(splitUri(uri));
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
  //fontSize改变,setFontState
  useUpdateEffect(() => {
    setFontState({
      ...fontState,
      fontSize,
      lineHeight: fontSize + 10,
    });
  }, [fontSize]);
  //book改变,这里用作监听章节变化
  useUpdateEffect(() => {
    setUri(props.chapterList[book.preChapter].uri);
    setLoading(true);
  }, [book]);

  //本章内容改变或者字体改变，重新切割
  useUpdateEffect(() => {
    //切割完成
    setPageBook(splitBook(msg, textXY, fontState));
    setLoading(false);
    setCurPage(0);
  }, [msg, fontState]);
  //设备宽度
  const deviceW = Dimensions.get('window').width;
  const text = React.useRef(null);
  let statusBarHeight;
  if (Platform.OS === 'ios') {
    StatusBarManager.getHeight((height: number) => {
      statusBarHeight = height;
    });
  } else {
    statusBarHeight = StatusBar.currentHeight;
  }
  return (
    <View _dark={{background: 'dark.100'}}>
      <View style={{height: 0, width: 0, display: 'none'}}>
        <WebView
          startInLoadingState={true}
          ref={web}
          source={{
            uri,
            headers: {
              userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
            },
          }}
          userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
          injectedJavaScript={jsCode ? jsCode : ''}
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
      <StatusBar
        // animated={true}
        translucent={true}
        barStyle="dark-content"
        // hidden={true}
        backgroundColor={'transparent'}
      />
      <Pressable
        position="relative"
        top={statusBarHeight}
        height="100%"
        paddingX="5"
        paddingTop="0"
        // bg="red.100"
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
          onLayout={event => {
            let msg = event.nativeEvent.layout;
            // console.log(event.nativeEvent.layout);
            setTextXY({width: msg.width, height: msg.height});
          }}
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
          bottom={10}
          right={8}>
          {curPage + 1}/{pageBook.length}
        </Text>
      </Pressable>
      <Loading isOpen={loading} />
      <ReadFooter
        chapterList={props.chapterList}
        fontSize={[fontSize, setFontSize]}
        bookMsg={getBook(props.name)}
        isOpen={footerIsOpen}
      />
    </View>
  );
};
export default connect(
  (state: StoreState) => {
    console.log(state);
    return {};
  },
  {set_shelf, edit_book},
)(Read);
