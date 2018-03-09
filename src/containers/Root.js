import React, { Component } from 'react'
import {ToastContainer} from 'react-toastify'
import { HashRouter } from 'react-router-dom'
import Routes from '../routes'
import Header from '../components/Header'
import SideMenu from '../components/sidemenu/SideMenu';
export default class Root extends Component {

  render() {
    return (
      <div>
        <ToastContainer hideProgressBar position='top-right' style={{top: 50}} />
        <HashRouter>
          <div>
            <Header />
            <SideMenu />
            <Routes />
          </div>
        </HashRouter>
      </div>
    )
  }
}
