import React from 'react';
import {Text, View, Modal, Button} from 'native-base';
import {WebView} from 'react-native-webview';
import RNFS from 'react-native-fs';

//引入action
import {set_shelf} from '../redux/actions/bookshelf';
//引入connect用于连接UI组件与redux
import {connect} from 'react-redux';
import {StoreState} from '../types/store';
import {store} from '../redux/store';

interface Props {
  name: string;
}
const Read: React.FC<Props> = props => {
  //目录不存在则添加目录
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
    console.log(data);
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
  const [uri, setUri] = React.useState(
    'https://www.ptwxz.com/html/8/8927/5821159.html',
  );
  const [msg, setMsg] = React.useState('');
  const [book, setBook] = React.useState();
  const web = React.useRef<WebView>(null);
  return (
    <View>
      <View style={{height: 0, width: 0, display: 'none'}}>
        <WebView
          startInLoadingState={true}
          ref={web}
          source={{uri}}
          injectedJavaScript={jsCode}
          onMessage={event => {
            // setMsg(event.nativeEvent.data);
            // write(res[0], 'a', res[1], 'utf8');
            getChapterList(props.name);
            console.log(event.nativeEvent.data);
            // addBookshelf(res[0]);
          }}
          onLoadEnd={() => {
            web && web.current!.injectJavaScript('window.test()');
          }}
        />
      </View>
      <Text>阅读</Text>
    </View>
  );
};
export default connect(
  (state: StoreState) => {
    console.log(state);
    return {};
  },
  {set_shelf},
)(Read);
