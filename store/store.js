import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import goldReducer from './gold.js';
import githubReducer from './github.js';
import axios from 'axios';

const serverAxios = axios.create({
  baseURL: 'https://extension-ms.juejin.im/'
});
const clientAxios = axios.create({
  baseURL: '/'
});

const reducer = combineReducers({
  gold: goldReducer,
  github: githubReducer,
});

const initialState = {};

export const initializeStore = (preloadedState = initialState, isServer) => {

  return createStore(
    reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware(thunk.withExtraArgument(isServer ? serverAxios : clientAxios)))
  )
}
