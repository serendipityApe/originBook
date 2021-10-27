import {Store} from 'redux';

export interface StoreState extends Store {
  bookshelf: StoreBookshelf;
}

export interface StoreBookshelf {
  contents: {}[];
}
