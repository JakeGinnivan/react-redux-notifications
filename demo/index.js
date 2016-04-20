import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import { middleware as NotificationMiddleware } from '../src/notifications.redux'
import demoApp from './reducers'

let store = createStore(
  demoApp,
  compose(
    applyMiddleware(ReduxThunk, NotificationMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : _ => _
  )
)

const app = document.getElementsByClassName('demonstration')[0]

ReactDOM.render(<Provider store={store}>
  <App />
</Provider>, app);

if (module.hot) {
  module.hot.accept('./reducers', () => {
    store.replaceReducer(require('./reducers'))
  })
}
