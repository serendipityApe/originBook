/*
    该文件专门为bookshelf组件生成action对象
*/
import * as constants from '../constants';
import {StoreBookshelf} from '../../types/store';
export interface SET_SHELF {
  type: constants.SET_SHELF_t;
  data: StoreBookshelf;
}
export type All = SET_SHELF;

//同步action，就是指action的值为Object类型的一般对象
export const set_shelf = (data: StoreBookshelf) => ({
  type: constants.SET_SHELF,
  data,
});
