import React, { Component } from 'react'
import Routes from '../routes'
import Header from '../components/Header'
import SideMenu from '../components/sidemenu/SideMenu';
import {ConnectedRouter} from 'react-router-redux'
import {connect} from 'react-redux'
import {Components} from 'super-admin-components'
import {toast} from 'react-toastify'
import {Dimmer, Loader} from 'semantic-ui-react'
const {LoginForm} = Components
@connect(state => {
  const {router, project} = state
  return {
    router,
    project
  }
})
export default class Root extends Component {
  state = {
    isLogin: false,
    key: 1,
    isGettingStructure: false,
    isError: false,
    isGettingProject: true
  }

  componentDidMount () {
    this._checkLogin()
  }

  _checkLogin = () => this.setState({isLogin: window.localStorage.isLogin && window.localStorage.isLogin === 'true'})

  _handleLoginRespond = (result) => {
    if (result && !result.errors) {
      toast.success('Login successfully.')
      this.setState({
        isGettingProject: true
      })
      this._checkLogin()
    } else {
      if (result.errors) {
        toast.error(result.errors[0].message)
      } else {
        toast.error('Cannt login! Please try again.')
      }
    }
  }
  _selectApp = (project) => {
    this.setState({isGettingProject: false}, () => {
      const {dispatch} = this.props
      dispatch({
        type: 'CHANGE_APP',
        payload: project
      })
      this.setState({key: this.state.key + 1})
    })
  }

  render() {
    const {project, dispatch, history, router} = this.props
    const { isLogin, key, isGettingProject } = this.state
    // if (!router.location) return null
    const {location = {}} = router
    const {pathname = ''} = location || {}
    // const {location: {pathname = ''}} = router
    // if (pathname === '/project-invitation') return null
    if (!isLogin) return <LoginForm onLogin={this._handleLoginRespond} />
    return (
      <ConnectedRouter history={history}>
        <div>
          <Header
            onLogout={this._checkLogin}
            onSelectApp={this._selectApp}
            project={project}
            dispatch={dispatch}
          />
          <SideMenu />
          <div id='page-bg'>
            {isGettingProject ? <Dimmer active inverted style={{backgroundColor: '#eee'}}><Loader /></Dimmer>
            : <React.Fragment>
              {!!(project.get('list').toJS().length || pathname === '/project/list' || pathname === '/project/add') && <Routes key={key}/>}
            </React.Fragment>}
          </div>
        </div>
      </ConnectedRouter>
    )
  }
}
