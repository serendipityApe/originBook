import React from 'react';
import {Text, View, Modal, Button, Box} from 'native-base';
import {WebView} from 'react-native-webview';
import RNFS from 'react-native-fs';

//引入action
import {set_shelf} from '../redux/actions/bookshelf';
//引入connect用于连接UI组件与redux
import {connect} from 'react-redux';
import {StoreState} from '../types/store';
import {store} from '../redux/store';
import Read from './read';
function PureBook(props: any) {
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
      let data = await RNFS.writeFile(path, contents, encoding);
      console.log('path=' + path);
    } catch (err) {
      console.log(err);
    }
  }
  //解析目的地址传来的string
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
  const [uri, setUri] = React.useState('https://www.ptwxz.com/html/8/8927/');
  const [name, setName] = React.useState('');
  const [purify, setPurify] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const web = React.useRef<WebView>(null);
  return (
    <View>
      <View style={{height: '100%', width: '100%', overflow: 'hidden'}}>
        {purify ? (
          <Read name={name} />
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
              setPurify(true);
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
            <Text>检测到该网站支持净化阅读，是否净化</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                web && web.current!.injectJavaScript('window.test()');
                setShowModal(false);
              }}>
              净化
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
}
export default connect(
  (state: StoreState) => {
    console.log(state);
    return {};
  },
  {set_shelf},
)(PureBook);
