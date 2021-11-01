import {Store} from 'redux';

export interface StoreState extends Store {
  bookshelf: StoreBookshelf;
}

export interface StoreBookshelf {
  contents: {name: string; pUri: string; preChapter: number}[];
}

export interface setBookshelf {
  name: string;
  preChapter: number;
  pUri: string;
}
export interface editBook {
  name: string;
  preChapter?: number;
  pUri?: string;
}

export type storeBookMsg = {
  name: string;
  preChapter: number;
  pUri: string;
};
