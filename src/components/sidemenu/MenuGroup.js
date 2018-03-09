import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, Divider } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames'

class MenuGroup extends Component {
  state = {
    collapsed: true
  }

  componentDidMount () {
    const {data, history} = this.props
    const activeRoute = '/' + history.location.pathname.split('/')[1]
    data.items.map(item => (activeRoute === item.to || history.location.pathname === item.to) && this.setState({collapsed: false}))
  }

  render () {
    const {data} = this.props
    const {collapsed} = this.state
    const menuGroupClassNames = classNames({
      'menu-group': true,
      collapsed: collapsed
    })
    let hint = ''
    const items = data.items.map((item, index) => {
      hint += item.title
      if (index !== data.items.length - 1) hint += ', '
      return <NavLink
        key={index}
        exact={item.exact}
        to={item.to}>
        <Icon name={item.icon} />
        {item.title}
      </NavLink>
    })
    return (
      <div className={menuGroupClassNames}>
        <Divider />
        <h3 title={collapsed ? hint : ''} onClick={() => this.setState({collapsed: !collapsed})}>
          {data.title}
          <div style={{float: 'right', marginRight: 10}}>
            <Icon name='angle up' />
          </div>
          <div className='hint'>{hint}</div>
        </h3>
        <div className='menu' style={{height: items.length * 40}}>
          {items}
        </div>
      </div>
    )
  }
}

MenuGroup.propTypes = {
  data: PropTypes.object.isRequired,
  history: PropTypes.object
}

export default MenuGroup
