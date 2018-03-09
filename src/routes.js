import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import asyncComponent from './libs/asyncComponent'
const Home = asyncComponent(() => import('./containers/Home').then(module => module.default))
const VideoList = asyncComponent(() => import('./containers/video/VideoList').then(module => module.default))
const CreateVideo = asyncComponent(() => import('./containers/video/CreateVideo').then(module => module.default))
const SeriesList = asyncComponent(() => import('./containers/series/SeriesList').then(module => module.default))
const CreateSeries = asyncComponent(() => import('./containers/series/CreateSeries').then(module => module.default))
const ChannelList = asyncComponent(() => import('./containers/channel/ChannelList').then(module => module.default))
const CreateChannel = asyncComponent(() => import('./containers/channel/CreateChannel').then(module => module.default))
export default class Routes extends Component {
  render () {
    return (
      <div id='page-bg'>
        <Route exact path='/' component={Home} />
        <Route path='/video/list' component={VideoList} />
        <Route path='/video/add' component={CreateVideo} />
        <Route path='/series/list' component={SeriesList} />
        <Route path='/series/add' component={CreateSeries} />
        <Route path='/channel/list/:page?' component={ChannelList} />
        <Route path='/channel/add' component={CreateChannel} />
      </div>
    )
  }
}
