/*
    该模块是用于定义action对象中type类型的常量值，目的只有一个：便于管理的同时防止程序员单词写错
*/
export const SET_SHELF = 'set_shelf';
export type SET_SHELF_t = typeof SET_SHELF;

export const EDIT_BOOK = 'edit_book';
export type EDIT_BOOK_t = typeof EDIT_BOOK;
