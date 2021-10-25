import React from 'react';
import {Text, View, ScrollView, Modal, Button} from 'native-base';
import {WebView} from 'react-native-webview';
import RNFS from 'react-native-fs';

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
/* //处理路径
function myPath(LastDirectory: string, name: string): string {
  return RNFS.CachesDirectoryPath + '/myBook' + `/${LastDirectory}/${name}.txt`;
} */
function ReadBook({navigation}) {
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
  const [msg, setMsg] = React.useState('');
  const [purify, setPurify] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const web = React.useRef<WebView>(null);
  return (
    <View>
      <View
        style={
          purify
            ? {height: 0, width: 0, display: 'none'}
            : {height: '100%', width: '100%', overflow: 'hidden'}
        }>
        <WebView
          startInLoadingState={true}
          ref={web}
          source={{uri}}
          injectedJavaScript={jsCode}
          onMessage={event => {
            setMsg(event.nativeEvent.data);
            let res = analysis(event.nativeEvent.data);
            write(res[0], 'a', res[1], 'utf8');
          }}
          onLoadEnd={() => {
            setShowModal(true);
          }}
        />
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
                setPurify(true);
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
export default ReadBook;