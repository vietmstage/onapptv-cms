import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Image, Dropdown, Button, Icon, Label } from 'semantic-ui-react'
import Logo from '../assests/mstage-logo.png'
import Avatar from '../assests/chien.png'
import {Link} from 'react-router-dom'

const ListItem = [
  {
    title: 'Chien\'s test',
    description: 'Accounts sign up last 30 days, with sign up device is equal to iOS'
  },
  {
    title: 'Most video viewer',
    description: 'Profiles view more than 300 videos last 90 days'
  },
  {
    title: 'Most pay',
    description: 'Accounts who pay us more than $500'
  }
]

export default class Header extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    onLogout: PropTypes.func,
    onSelectApp: PropTypes.func
  }

  _handleDropdown = (e, {value}) => {
    if (value === 'sign-out') {
      window.localStorage.isLogin = false
      this.props.onLogout()
    }
  }

  _createDopdownListItem = () => {
    return ListItem.map((item, index) => {
      return {
        key: index,
        value: index,
        text: item.title,
        content: <div>
          <strong>
            {item.title}
          </strong>
          <br />
          <span style={{color: 'gray', fontSize: 12}}>
            {item.description}
          </span>
        </div>
      }
    })
  }

  render () {
    const curHr = new Date().getHours()
    const trigger = (
      <span>
        <Image avatar src={Avatar} style={{border: '2px solid #fff', marginTop: 6}} />
      </span>
    )

    const options = [
      {
        key: 'user',
        value: 'user',
        text: 'Account',
        content: <div>
          <Link to='/account' style={{color: '#444', display: 'block'}}>
            <Icon name='user' /> Account</Link>
        </div>
      },
      {
        key: 'settings',
        value: 'settings',
        text: 'Settings',
        content: <div>
          <Link to='/settings' style={{color: '#444', display: 'block'}}>
            <Icon name='settings' /> Settings</Link>
        </div>
      },
      {
        key: 'sign-out',
        value: 'sign-out',
        text: 'Sign Out',
        content: <div><Icon name='sign out' /> Logout</div>
      }
    ]

    let greeting = 'Good evening'
    if (curHr < 12) greeting = 'Good morning'
    else if (curHr < 18) greeting = 'Good afternoon'

    return (
      <div id='header'>
        <div className='left logo'>
          <img alt='logo' src={Logo} height={20} />
          <span>Userkit Video</span>
        </div>
        <div className='right'>
          <Dropdown
            selectOnBlur={false}
            selectOnNavigation={false}
            className='user-menu'
            trigger={trigger}
            options={options}
            pointing='top right'
            icon={null}
            value={null}
            onChange={this._handleDropdown}
            header={<div className='header'>{greeting}, <b>Super admin</b></div>}
          />

          <Dropdown
            selectOnNavigation={false}
            selectOnBlur={false}
            className='notification'
            trigger={<span>
              <Button
                icon='bell'
                size='large'
                color='green'
                style={{marginTop: 8, marginRight: 15, padding: 5}}
              />
              <Label
                circular
                size='mini'
                color='red'
                floating
                content={3}
              />
            </span>}
            options={this._createDopdownListItem()}
            pointing='top right'
            icon={null}
            value={null}
            onChange={this._handleDropdown}
          />
        </div>
      </div>
    )
  }
}
