/*
    该文件专门为bookshelf组件生成action对象
*/
import * as constants from '../constants';
import {setBookshelf, editBook} from '../../types/store';
export interface SET_SHELF {
  type: constants.SET_SHELF_t;
  data: setBookshelf;
}

export interface EDIT_BOOK {
  type: constants.EDIT_BOOK_t;
  data: editBook;
}

export type All = SET_SHELF | EDIT_BOOK;

//同步action，就是指action的值为Object类型的一般对象
export const set_shelf = (data: setBookshelf) => ({
  type: constants.SET_SHELF,
  data,
});

export const edit_book = (data: editBook) => ({
  type: constants.EDIT_BOOK,
  data,
});
