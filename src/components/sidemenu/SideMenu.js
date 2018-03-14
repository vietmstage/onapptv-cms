import React from 'react'
import menuData from './menuData'
import MenuGroup from './MenuGroup'
import { Route, NavLink } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import mobileMenuData from './mobileMenuData';

const SideMenu = () => <Route render={({history}) => (
  <div id='side-menu'>
    <div className='menu-group'>
      <div className='menu' style={{height: 40}}>
        <NavLink exact to='/'> <Icon name='dashboard' /> Dashboard</NavLink>
      </div>
    </div>

    {menuData.map((data, index) => <MenuGroup data={data} key={index} history={history} />)}

    <div className='menu-group'>
      <div className='menu' style={{height: 40}}>
        <NavLink exact to='/mobile'> <Icon name='dashboard' /> Mobile Dashboard</NavLink>
      </div>
    </div>

    {mobileMenuData.map((data, index) => <MenuGroup data={data} key={index} history={history} />)}
    
  </div>)} />

export default SideMenu
