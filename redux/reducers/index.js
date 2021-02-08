// Dependencies
import { combineReducers } from 'redux';

// Reducers
import form from './formReducer';

// Combine reducers
const rootReducer = combineReducers({
    form,
});

export default rootReducer;