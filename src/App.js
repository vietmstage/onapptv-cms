import React, { Component } from 'react';
import {Provider} from 'react-redux'
import configureStore from './store/configureStore'
import Root from './containers/Root'
// import createHistory from 'history/createBrowserHistory'

class App extends Component {
  render() {
    const store = configureStore()
    // const history = createHistory()

    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}

export default App;
