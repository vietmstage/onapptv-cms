import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import asyncComponent from './libs/asyncComponent'
const ArchivedSeriesList = asyncComponent(() => import('./containers/series/ArchivedSeriesList').then(module => module.default))
const ArchivedVideoList = asyncComponent(() => import('./containers/video/ArchivedVideoList').then(module => module.default))
const Home = asyncComponent(() => import('./containers/Home').then(module => module.default))
const VideoList = asyncComponent(() => import('./containers/video/VideoList').then(module => module.default))
const CreateVideo = asyncComponent(() => import('./containers/video/CreateVideo').then(module => module.default))
const EditVideo = asyncComponent(() => import('./containers/video/EditVideo').then(module => module.default))
const SeriesList = asyncComponent(() => import('./containers/series/SeriesList').then(module => module.default))
const CreateSeries = asyncComponent(() => import('./containers/series/CreateSeries').then(module => module.default))
const EditSeries = asyncComponent(() => import('./containers/series/EditSeries').then(module => module.default))
const ChannelList = asyncComponent(() => import('./containers/channel/ChannelList').then(module => module.default))
const CreateChannel = asyncComponent(() => import('./containers/channel/CreateChannel').then(module => module.default))
const EditChannel = asyncComponent(() => import('./containers/channel/EditChannel').then(module => module.default))
const ArchivedChannelList = asyncComponent(() => import('./containers/channel/ArchivedChannelList').then(module => module.default))
const NewsList = asyncComponent(() => import('./containers/news/NewsList').then(module => module.default))
const CreateNews = asyncComponent(() => import('./containers/news/CreateNews').then(module => module.default))
const EditNews = asyncComponent(() => import('./containers/news/EditNews').then(module => module.default))
const AdsList = asyncComponent(() => import('./containers/ads/AdsList').then(module => module.default))
const CreateAds = asyncComponent(() => import('./containers/ads/CreateAds').then(module => module.default))
const EditAds = asyncComponent(() => import('./containers/ads/EditAds').then(module => module.default))
const CreateMeta = asyncComponent(() => import('./containers/meta/CreateMeta').then(module => module.default))
const MetaList = asyncComponent(() => import('./containers/meta/MetaList').then(module => module.default))
const EpgList = asyncComponent(() => import('./containers/epg/EpgList').then(module => module.default))
const ArchivedEpgList = asyncComponent(() => import('./containers/epg/ArchivedEpgList').then(module => module.default))
const Config = asyncComponent(() => import('./containers/settings/Config').then(module => module.default))
export default class Routes extends Component {
  render () {
    return (
      <React.Fragment>
        <Route exact path='/' component={Home} />
        <Route path='/video/list/:page?' component={VideoList} />
        <Route path='/video/add' component={CreateVideo} />
        <Route path='/video/edit/:videoId' component={EditVideo} />
        <Route path='/video/archived/:page?' component={ArchivedVideoList} />
        <Route path='/series/list/:page?' component={SeriesList} />
        <Route path='/series/add' component={CreateSeries} />
        <Route path='/series/edit/:seriesId' component={EditSeries} />
        <Route path='/series/archived/:page?' component={ArchivedSeriesList} />
        <Route path='/channel/list/:page?' component={ChannelList} />
        <Route path='/channel/add' component={CreateChannel} />
        <Route path='/channel/edit/:channelId?' component={EditChannel} />
        <Route path='/channel/archived/:page?' component={ArchivedChannelList} />
        <Route path='/news/list/:page?' component={NewsList} />
        <Route path='/news/add' component={CreateNews} />
        <Route path='/news/edit/:newsId' component={EditNews} />
        <Route path='/ads/list/:page?' component={AdsList} />
        <Route path='/ads/add' component={CreateAds} />
        <Route path='/ads/edit/:adsId?' component={EditAds} />
        <Route path='/file/add' component={CreateMeta} />
        <Route path='/file/list/:page?' component={MetaList} />
        <Route path='/epg/list/:page?' component={EpgList} />
        <Route path='/epg/archived/:page?' component={ArchivedEpgList} />
        <Route path='/settings/config' component={Config} />
      </React.Fragment>
    )
  }
}
