import React, { Component } from 'react';
import {Provider} from 'react-redux'
import store from './store/configureStore'
import Root from './containers/Root'
import {ToastContainer} from 'react-toastify'
import createHistory from 'history/createBrowserHistory'
import initSAC from 'super-admin-components'
initSAC('production')
const history = createHistory({basename: '#'})

class App extends Component {
  render() {

    return (
      <Provider store={store}>
        <React.Fragment>
          <ToastContainer hideProgressBar position='top-right' style={{top: 50}} />      
          <Root history={history}/>
        </React.Fragment>
      </Provider>
    );
  }
}

export default App;
