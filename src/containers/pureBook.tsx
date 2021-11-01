import React from 'react';
import {Text, View, Modal, Button} from 'native-base';
import {WebView} from 'react-native-webview';
import RNFS from 'react-native-fs';

//引入action
import {set_shelf, edit_book} from '../redux/actions/bookshelf';
//引入connect用于连接UI组件与redux
import {connect} from 'react-redux';
import {StoreState} from '../types/store';
import Read from './read';

//@type
import {storeBookMsg} from '../types/store';
import {navigationProp} from '../types/navigate';
interface Props {
  uri: string;
  edit_book: Function;
  set_shelf: Function;
  books: storeBookMsg[];
  navigation: navigationProp;
}
const PureBook: React.FC<Props> = props => {
  async function myMkdir(path: string) {
    try {
      let isExists = await RNFS.exists(path);
      if (!isExists) {
        RNFS.mkdir(path);
        console.log('创建成功');
      }
    } catch (err) {
      console.log(err);
    }
  }
  //讲解析后的书籍内容写入缓存
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
      console.log('path=' + path);
    } catch (err) {
      console.log(err);
    }
  }
  function checkUri(uri: string) {
    var reg =
      /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    return reg.test(uri);
  }
  //解析目的地址传来的string
  function analysis(contents: string): string[] {
    let index = contents.indexOf('&');
    let res = [];
    res.push(contents.slice(0, index).replace('&', ''));
    res.push(contents.slice(index + 1));
    return res;
  }
  //将不存在的书加入书架或者更新已存在的书
  function addBookshelf(name: string) {
    // let books = store.getState().bookshelf.contents;
    const {books} = props;
    //flag为true则书不存在
    let flag = true;
    for (let item of books) {
      if (item.name === name) {
        flag = false;
        break;
      }
    }
    if (flag) {
      props.set_shelf({name, pUri: props.uri, preChapter: 0});
    } else {
      props.edit_book({name, pUri: props.uri});
    }
  }
  const jsCode = `
    window.test = function(){
      let lists=document.querySelectorAll('.centent li a');
      var chaperlist=[];
      var bookName=document.querySelector('.title h1').innerHTML.replace('最新章节','');
      for(let i=0;i<lists.length;i++){
        chaperlist.push({name:lists[i].innerHTML,uri:lists[i].href});
      }
      window.ReactNativeWebView.postMessage(bookName + '&' +JSON.stringify(chaperlist));
    }
    `;
  // const [uri, setUri] = React.useState('https://www.ptwxz.com/html/8/8927/');
  const [checkUriRes, setCheckUriRes] = React.useState(checkUri(props.uri));
  const [name, setName] = React.useState('');
  const [purify, setPurify] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [chapterList, setChapterList] = React.useState([]);
  const web = React.useRef<WebView>(null);
  const uri = props.uri;

  useUpdateEffect(() => {
    if (!checkUriRes && showModal === false) {
      props.navigation.navigate('Home', {});
    }
  }, [showModal]);
  useUpdateEffect(() => {
    setPurify(true);
  }, [chapterList]);

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
  return (
    <View>
      <View style={{height: '100%', width: '100%', overflow: 'hidden'}}>
        {purify ? (
          <Read chapterList={chapterList} name={name} />
        ) : (
          <WebView
            startInLoadingState={true}
            ref={web}
            source={{uri}}
            injectedJavaScript={jsCode}
            onMessage={event => {
              let res = analysis(event.nativeEvent.data);
              setName(res[0]);
              write(res[0], 'a', res[1], 'utf8');
              addBookshelf(res[0]);
              setChapterList(JSON.parse(res[1]));
            }}
            onLoadEnd={() => {
              setShowModal(true);
            }}
          />
        )}
      </View>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>提示</Modal.Header>
          <Modal.Body>
            <Text>
              {checkUriRes
                ? '检测到该网站支持净化阅读，是否净化'
                : '抱歉，未检测到网址，或该网站暂时不支持净化阅读'}
            </Text>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                setShowModal(false);
                web && web.current!.injectJavaScript('window.test()');
              }}>
              净化
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
};
export default connect(
  (state: StoreState) => {
    // console.log(state);
    return {
      books: state.bookshelf.contents,
    };
  },
  {set_shelf, edit_book},
)(PureBook);
