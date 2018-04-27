import React, { Component } from 'react'
import ChangeTitle from '../../libs/ChangeTitle'
import { Tab } from 'semantic-ui-react'
import ConfigVideoMeta from './ConfigVideoMeta'
export default class Config extends Component {
  render() {
    ChangeTitle('Config')
    const panes = [
      { menuItem: 'Video Meta', render: () => <ConfigVideoMeta type='video-meta' key='video-meta' /> },
      { menuItem: 'Channel Meta', render: () => <ConfigVideoMeta type='channel-meta' key='channel-meta' /> },
      { menuItem: 'Image Name', render: () => <ConfigVideoMeta type='image-name' key='image-name' /> }
    ]
    return (
      <Tab menu={{ color: 'blue', secondary: true, pointing: true }} panes={panes} />
    )
  }
}
