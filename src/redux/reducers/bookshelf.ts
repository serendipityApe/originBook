/*
    1.该文件是用于创建一个为bookshelf组件服务的reducer，reducer的本质就是一个函数
    2.reducer函数会接到两个参数，分别为：之前的状态(preState)，动作对象(action)
*/
import {SET_SHELF, EDIT_BOOK} from '../constants';
import {StoreBookshelf, setBookshelf} from '../../types/store';
import {All} from '../actions/bookshelf';

const initState: StoreBookshelf = {
  contents: [{name: '默认', pUri: '', preChapter: 0}],
}; //初始化状态
export default function bookshelfReducer(
  preState: StoreBookshelf = initState,
  action: All,
): StoreBookshelf {
  //从action对象中获取：type、data
  const {type, data} = action;
  //根据type决定如何加工数据
  switch (type) {
    case SET_SHELF:
      // preState.contents.push(data); 不能直接修改preState...只有preState和curState不同才提交修改
      return {contents: [...preState.contents, data as setBookshelf]};
    // return { contents: [{ name: '默认', pUri: '', preChapter: 0 }] };
    case EDIT_BOOK:
      let res = preState.contents.map(item => {
        if (item.name === data.name) {
          return {...data, pUri: data.pUri ? data.pUri : item.pUri};
        }
        return item;
      });
      return {contents: res};
    default:
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const exhaustiveCheck: never = type; //走default时会报错   类型“xxx”的参数不能赋给类型“never”的参数。来确保actions的类型正确
      return preState;
  }
}
