import {createStore, combineReducers} from 'redux';
import reducer from '../Reducer';

// const mainReduser = combineReducers({
//   main: reducer,
//   secondery: reducer,
// });
const store = createStore(reducer);

export default store;
