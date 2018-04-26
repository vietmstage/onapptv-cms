import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import Logo from '../assests/mstage-logo.png'
// import Avatar from '../assests/chien.png'
import {toast} from 'react-toastify'
import {Link} from 'react-router-dom'
import { Components, Actions } from 'super-admin-components'
import findIndex from 'lodash/findIndex'


const { UserInfo } = Components
const {projects: projectActions} = Actions

export default class Header extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    onLogout: PropTypes.func,
    onSelectApp: PropTypes.func
  }

  state = {
    projectOptions: [],
    selectedProject: '',
    projects: [],
    loadingProjects: false,
    userInfo: {}
  }

  _handleCallback = (data) => {
    const {onLogout, dispatch} = this.props
    if (!data || data.errors) {
      toast.error('Cannot get user info. Please login again!')
      window.localStorage.removeItem('isLogin')
      window.localStorage.removeItem('superadmin_user_token')
      onLogout && onLogout()
      return
    }
    this.setState({loadingProjects: true, userInfo: data.data})
    projectActions.getProjects({type: 'CONTENTKIT'}).then(result => {
      this.setState({loadingProjects: false})
      if (!result || result.errors) return
      const {data} = result.data
      let selectedProject = ''
      let projectOptions = []
      if (data.length) {
        if (window.localStorage.selectedProject && findIndex(data, {id: window.localStorage.selectedProject}) === -1) {
          window.localStorage.removeItem('selectedProject')
        }
        selectedProject = window.localStorage.selectedProject ? window.localStorage.selectedProject : data[0].id
        this.props.onSelectApp(data[findIndex(data, {id: selectedProject})])
      } else {
        this.props.onSelectApp({})
      }
      dispatch && dispatch({
        type: 'GET_PROJECT_LIST',
        result: data
      })
      data.map(project => projectOptions.push({value: project.id, text: project.name}))
      this.setState({selectedProject, projects: data})
    })
  }

  _handleLogout = () => {
    window.localStorage.removeItem('isLogin')
    window.localStorage.removeItem('superadmin_user_token')
    this.props.onLogout()
  }

  _selectApp = (e, {name, value}) => {
    this.setState({
      [name]: value
    })
    window.localStorage.selectedProject = value
    const {projects} = this.state
    const index = findIndex(projects, {id: value})
    this.props.onSelectApp(projects[index])
  }

  render () {
    const {project} = this.props
    const {selectedProject, userInfo} = this.state
    const curHr = new Date().getHours()
    let projectOptions = []
    const projectList = project.get('list').toJS() || []
    projectList.map(project => projectOptions.push({value: project.id, text: project.name}))

    let greeting = 'Good evening'
    if (curHr < 12) greeting = 'Good morning'
    else if (curHr < 18) greeting = 'Good afternoon'

    return (
      <div id='header'>
        <div className='left logo'>
          <Link to='/'>
            <img alt='logo' src={Logo} height={20} />
            <span>Userkit Video</span>
          </Link>
        </div>
        <div className='left selected-app'>
          Selected project:
          &nbsp;
          <Dropdown
            name='selectedProject'
            selectOnNavigation={false}
            style={{fontWeight: 'bold'}}
            value={selectedProject}
            options={projectOptions}
            selectOnBlur={false}
            onChange={this._selectApp}
          />
        </div>
        <div className='right'>
          <Dropdown
            selectOnBlur={false}
            selectOnNavigation={false}
            className='user-menu'
            trigger={<UserInfo onCallback={this._handleCallback} />}
            pointing='top right'
            icon={null}
            value={null}
          >
            <Dropdown.Menu>
              <Dropdown.Header><div className='header'>{greeting}, <b>Super admin</b></div></Dropdown.Header>
              <Dropdown.Item icon='user' text='Account' as={Link} to={`/account/${userInfo.id}`} />
              <Dropdown.Item icon='settings' text='Settings' />
              <Dropdown.Item icon='sign out' text='Signout' onClick={this._handleLogout} />
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    )
  }
}
