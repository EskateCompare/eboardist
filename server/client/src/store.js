import { applyMiddleware, createStore, combineReducers } from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist-2';
import { composeWithDevTools } from 'redux-devtools-extension';

// import { promiseMiddleware } from './middleware'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

import User from './reducers/User';
import Main from './reducers/Main';
import CompareProducts from './reducers/CompareProducts';
import Product from './reducers/Product';

const loggerMiddleware = createLogger()

const reducer = combineReducers({
  User,
  Main,
  CompareProducts,
  Product,
})

const enhancers = [];
const middleware = applyMiddleware(thunkMiddleware, loggerMiddleware);
enhancers.push(middleware);
enhancers.push(autoRehydrate());

const composedEnhancer = composeWithDevTools(...enhancers);

const store = createStore(reducer, composedEnhancer);
persistStore(store);

export default store;
