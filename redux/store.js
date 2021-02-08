// Dependencies
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';

// Redux
import rootReducer from './reducers';
import thunk from "redux-thunk";
import AsyncStorage from '@react-native-community/async-storage';

// Middleware: Redux Persist Config
const persistConfig = {
    // Root
    key: 'root',
    // Storage Method (React Native)
    storage: AsyncStorage,
    // Whitelist (Save Specific Reducers)
    whitelist: [
        'form'
    ],
    blacklist: []
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store
const store = createStore(
    persistedReducer,
    applyMiddleware(
        // createLogger(),
        thunk
    ),
);

// Middleware: Persisted store
let persistedStore = persistStore(store);

// Exports
export { store, persistedStore };