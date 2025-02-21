import auth from 'app/auth/store/reducers';
import { combineReducers } from 'redux';
import fuse from './fuse';
import sanna from './sanna';

const createReducer = asyncReducers =>
	combineReducers({
		sanna,
		auth,
		fuse,
		...asyncReducers
	});

export default createReducer;
