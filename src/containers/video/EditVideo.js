import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getVideoById, updateVideo } from '../../actions/video';
import moment from 'moment'
import { Form, Segment, Button, Divider, Dimmer, Loader } from 'semantic-ui-react'
import Description from '../../components/Description'
import People from '../../components/selector/People'
import Genres from '../../components/selector/Genres'
import AllowedCountries from '../../components/selector/AllowedCountries'
import Tags from '../../components/selector/Tags'
import DropDown from '../../components/common/Dropdown'
import ThumbnailsList from '../../components/ThumbnailsList'
import DateTime from 'react-datetime'
import { toast } from 'react-toastify';
import { getSeriesById, seriesSearch } from '../../actions/series'
import debounce from 'lodash/debounce'
import isEmpty from 'lodash/isEmpty'
import MetaData from '../../components/MetaData'
export default class EditVideo extends Component {
  static propTypes = {

  }

  state = {
    videoData: {},
    seriesOptions: [],
    loadingVideo: false,
    searchingSeries: false,
    loading: false
  }
  
  componentWillMount () {
    const {match: {params: {videoId}}} = this.props
    if (videoId) {
      this.setState({loadingVideo: true})
      getVideoById(videoId).then(result => {
        if (result && !result.errors && result.data) {
          if (result.data.seriesId) {
            getSeriesById(result.data.seriesId).then(seriesResult => {
              if (seriesResult && !seriesResult.errors) {
                this.setState({
                  seriesOptions: [{text: seriesResult.data.title, value: seriesResult.data._id}]
                })
              }
            })
          }
          this.setState({videoData: result.data, loadingVideo: false})
        } else {
          this.setState({loadingVideo: false})
          toast.error('Can not get video detail.')
        }
      })
    }
  }

  _handleInputChange = (e, {name, value}) => {
    let {videoData} = this.state
    videoData[name] = value
    this.setState({
      videoData
    })
  }

  _handleUpdateoriginalImages = (originalImages) => {
    this.setState({
      videoData: {
        ...this.state.videoData,
        originalImages
      }
    })
  }

  _handleUpdateGenres = (genreIds) => {
    this.setState({
      videoData: {
        ...this.state.videoData,
        genreIds
      }
    })
  }

  _handleUpdateTags = (tags) => {
    this.setState({
      videoData: {
        ...this.state.videoData,
        tags
      }
    })
  }

  _handleUdateCountries = allowedCountries => {
    this.setState({
      videoData: {
        ...this.state.videoData,
        allowedCountries
      }
    })
  }

  _handleUpdateDescription = (data) => {
    console.log(data)
    this.setState({
      videoData: {
        ...this.state.videoData,
        ...data
      }
    })
  }

  _handleUpdatePeople = (data) => {
    this.setState({
      videoData: {
        ...this.state.videoData,
        ...data
      }
    })
  }

  _handleVideoCreate = () => {
    const {videoData} = this.state
    if (!videoData.originalImages || videoData.originalImages.length === 0) {
      toast.error('Please choose thumbnails for video')
      return
    }
    this.setState({loading: true})    
    updateVideo(videoData).then(data => {
      this.setState({loading: false})
      if(!(data.errors && data.errors.length)) {
        toast.success('Update video successfully!')
        this.props.history.push('/video/list')
        this.setState({
          videoData: {},
        })
      } else {
        toast.error('Failed to update the video!')
      }
    })
  }

  _handleSearchChange = (e, {searchQuery}) => {
    let {videoData} = this.state
    videoData.seriesId = null
    this.setState({searchingSeries: true, videoData})
    this._debounceSearch(searchQuery)
  }

  _debounceSearch = debounce((searchQuery) => {
    let options = []
    seriesSearch({text: searchQuery, limit: 20}).then(data => {
      this.setState({searchingSeries: false})
      if(data.items) {
        data.items.forEach(item => options.push({text: item.title, value: item._id}))
        this.setState({seriesOptions: options})
      }
    })
  }, 300)

  _handleUpdateMeta = (metadata) => {
    let {videoData} = this.state
    videoData.metadata = metadata
    this.setState({videoData})
  }

  render() {
    const {videoData, seriesOptions, loadingVideo, searchingSeries, loading} = this.state

    if (loadingVideo) return <div className='div__loading-full'><Dimmer inverted active><Loader /></Dimmer></div>

    if (!loadingVideo && isEmpty(videoData)) return <Segment><i style={{color: '#999'}}>Sorry. There's nothing to show.</i></Segment>

    const {
      title = '',
      genreIds = [],
      tags = [],
      directorIds = [],
      castIds = [],
      producerIds = [],
      shortDescription = '',
      longDescription = '',
      type = '',
      publishDate = moment(),
      durationInSeconds = 0,
      allowedCountries = [],
      seasonIndex = 0,
      episodeIndex = 0,
      seriesId = '',
      originalImages = [],
      metadata = {}
    } = videoData
    return (
      <div>
        <h2>Edit video</h2>
        <Divider />
        {
        <div>
          <Segment.Group>
            <Segment>
              <h4>Thumbnails Video</h4>
            </Segment>
            <Segment>
              <ThumbnailsList onDataCallback={this._handleUpdateoriginalImages} data={originalImages} isEdit />

            </Segment>
          </Segment.Group>
          <Segment.Group>
            <Segment><h4>Brightcove video detail</h4></Segment>
            <Segment>
              <div className='video-detail'>
                <div className="video__info">
                  <Form>
                    <Description
                      onDataCallback={this._handleUpdateDescription}
                      data={{title, shortDescription, longDescription}}
                    />
                    {/* <Form.Group widths='equal'>
                      <Form.Field>
                        <label>Video source:</label>
                        <DropDown
                          selection
                          placeholder='Select video source'
                          options={[
                            {key: 0, value: 'youtube', text: 'Youtube'},
                            {key: 1, value: 'brightcove', text: 'Brightcove'},
                            {key: 2, value: 'vimeo', text: 'Vimeo'}
                          ]}
                        />
                      </Form.Field>
                      <Form.Input
                        label='Values'
                        placeholder='Values'
                      />
                    </Form.Group> */}
                    <Form.Group widths='equal'>
                      <Genres onDataCallback={this._handleUpdateGenres} genreIds={genreIds}/>
                      
                      <Tags onDataCallback={this._handleUpdateTags} tags={tags}/>
                    </Form.Group>

                    <People onDataCallback={this._handleUpdatePeople} data={{directorIds, castIds, producerIds}}/>
                    
                    <Form.Group widths='equal'>
                      <AllowedCountries onDataCallback={this._handleUdateCountries} allowedCountries={allowedCountries}/>
                      <Form.Input
                        label='Duration in seconds'
                        placeholder='Duration in seconds'
                        value={durationInSeconds}
                        name='durationInSeconds'
                        onChange={(e, {name, value}) => this._handleInputChange(e, {name, value: parseFloat(value, 10)})}                    
                      />
                      <Form.Field>
                        <label>Publish Date</label>
                        <DateTime
                          utc
                          // timeFormat={false}
                          value={publishDate || new Date()}
                          name='publishDate'
                          onChange={date => this._handleInputChange(null, {name: 'publishDate', value: new Date(date)})}
                          closeOnSelect />
                      </Form.Field>
                    </Form.Group>
                    
                    <Form.Field>
                      <label>Type</label>
                      <DropDown
                        selection
                        options={[
                          {key: 0, value: 'Standalone', text: 'Standalone'},
                          {key: 1, value: 'Episode', text: 'Episode'}
                        ]}
                        placeholder='Select video type'
                        name='type'
                        value={type}
                        onChange={this._handleInputChange}
                      />
                    </Form.Field>
                    {type === 'Episode' && <div>
                      <Form.Field>
                        <label>Series</label>
                        <DropDown
                          name='seriesId'
                          selection search fluid
                          placeholder='Video series'
                          options={seriesOptions}
                          onChange={this._handleInputChange}
                          onSearchChange={this._handleSearchChange}
                          value={seriesId}
                          loading={searchingSeries}
                        />
                      </Form.Field>
                      <Form.Input
                        label='Season number:'
                        placeholder='Video season number'
                        name='seasonIndex'
                        value={seasonIndex || 0}
                        onChange={(e, {name, value}) => this._handleInputChange(e, {name, value: parseFloat(value, 10)})}
                      />
                      <Form.Input
                        label='Episode number:'
                        placeholder='Video episode number'
                        name='episodeIndex'
                        value={episodeIndex || 0}
                        onChange={(e, {name, value}) => this._handleInputChange(e, {name, value: parseFloat(value, 10)})}
                      />
                    </div>}
                  </Form>
                </div>
              </div>
            </Segment>
          </Segment.Group>
          <Segment.Group>
            <Segment>
              <h4>Meta Data</h4>
            </Segment>
            <Segment>
              <MetaData
                onUpdateMeta={this._handleUpdateMeta}
                metaData={metadata}
                type='video-meta'
              />
            </Segment>
          </Segment.Group>
          <div style={{textAlign: 'right'}}>
            <Button primary content='Update' onClick={this._handleVideoCreate} loading={loading}/>
          </div>
        </div>
        }
      </div>
    )
  }
}
