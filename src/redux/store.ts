import { createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import AsyncStorage from '@react-native-community/async-storage';

import reducer from './reducers';
import { StoreState } from '../types/store';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ["bookshelf"], //需要缓存的数据
  blacklist: [], //不需要缓存的数据
};

const persistedReducer = persistReducer(persistConfig, reducer);
//暴露store
const store: StoreState = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
