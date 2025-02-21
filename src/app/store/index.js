import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk'
import createReducer from './reducers';

const enhancer = compose(applyMiddleware(thunk));
export const store = createStore(createReducer(), enhancer);

store.asyncReducers = {};

export const injectReducer = (key, reducer) => {
	if (store.asyncReducers[key]) {
		return false;
	}
	store.asyncReducers[key] = reducer;
	store.replaceReducer(createReducer(store.asyncReducers));
	return store;
};
