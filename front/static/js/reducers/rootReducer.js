import { combineReducers } from 'redux'
import drawerReducer from './drawerReducer'
import searchReducer from './searchReducer'

const rootReducer = combineReducers({
	drawerReducer,
	searchReducer
});

export default rootReducer