// 合并所有reducer 并且返回
import { combineReducers } from 'redux'
// import {combineReducers} from 'redux-immutable';
import { exchange } from './exchange.redux'
export default combineReducers({exchange})