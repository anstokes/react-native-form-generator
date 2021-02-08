import React from 'react';
import { StyleSheet } from 'react-native';

// Import: Redux
import { store, persistedStore } from './redux/store';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';

// Import: Components
import Main from "./src/Main";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <Main />
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
