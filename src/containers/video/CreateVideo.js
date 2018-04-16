import React, { Component } from 'react'
import {Segment, Form, Button, Divider, Loader, Tab} from 'semantic-ui-react'
import DropDown from '../../components/common/Dropdown'
import { getVideoByContentId, createVideo } from '../../actions/video'
import DateTime from 'react-datetime'
import isEmpty from 'lodash/isEmpty'
import { toast } from 'react-toastify';
import moment from 'moment'
import ThumbnailsList from '../../components/ThumbnailsList'
import Genres from '../../components/selector/Genres'
import Tags from '../../components/selector/Tags'
import AllowedCountries from '../../components/selector/AllowedCountries'
import Description from '../../components/Description'
import People from '../../components/selector/People'
import ChangeTitle from '../../libs/ChangeTitle'
import debounce from 'lodash/debounce'
import { seriesSearch } from '../../actions/series'
export default class CreateVideo extends Component {
  state = {
    contentId: '',
    videoSource: '',
    seriesOptions: [],
    videoData: {},
    key: '',
    isLoadingVideo: false,
    showForm: false
  }

  _handleGetVideo = (type = 'brightcove') => {
    const {contentId} = this.state
    this.setState({isLoadingVideo: true})
    getVideoByContentId(contentId, type).then(result => {
      this.setState({isLoadingVideo: false})
      console.log(result)
      if (!result) {
        toast.error('Can\'t get video detail')
        return
      }
      if (result.errors) {
        toast.error(result.errors[0].message)
        return
      }
      if (result.videoOne !== null) {
        toast.error('This video had created!')
        return
      }
      const {data} = result
      let videoData = {...data, contentId}
      delete videoData['__typename']

      this.setState({
        videoData,
        key: new Date().getTime().toString(),
        showForm: true
      })
    })
  }

  _handleVideoCreate = () => {
    const {videoData} = this.state
    if (!videoData.originalImages || videoData.originalImages.length === 0) {
      toast.error('Please choose thumbnails for video.')
      return
    }
    createVideo(videoData).then(data => {
      if(!(data.errors && data.errors.length)) {
        toast.success('Create video successfully!')
        this.setState({
          contentId: '',
          videoData: {},
        })
      } else {
        toast.error('Failed to create the video!')
      }
    })
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

  _handleSearchChange = (e, {searchQuery}) => {
    this._debounceSearch(searchQuery)
  }

  _debounceSearch = debounce((searchQuery) => {
    let options = []
    seriesSearch(searchQuery).then(data => {
      if(data.items) {
        data.items.forEach(item => options.push({text: item.title, value: item._id}))
        this.setState({seriesOptions: options})
      }
    })
  }, 300)

  _renderGetBrightcove = () => {
    const {contentId} = this.state
    return <Tab.Pane>
      <Form>
        <Form.Input
          placeholder='Insert brightcove Id here'
          value={contentId}
          onChange={e => this.setState({contentId: e.target.value})}
        />
        <Button primary size='tiny' content='Load content' onClick={this._handleGetVideo}/>
      </Form>
    </Tab.Pane>
  }

  _renderGetYoutube = () => {
    const {contentId} = this.state
    return <Tab.Pane>
      <Form>
        <Form.Input
          placeholder='Insert Youtube Id here'
          value={contentId}
          onChange={e => this.setState({contentId: e.target.value})}
        />
        <Button primary size='tiny' content='Load content' onClick={() => this._handleGetVideo('youtube')}/>
      </Form>
    </Tab.Pane>
  }

  _renderGetVimeo = () => {
    const {contentId} = this.state
    return <Tab.Pane>
      <Form>
        <Form.Input
          placeholder='Insert Vimeo Id here'
          value={contentId}
          onChange={e => this.setState({contentId: e.target.value})}
        />
        <Button primary size='tiny' content='Load content' onClick={() => this._handleGetVideo('vimeo')}/>
      </Form>
    </Tab.Pane>
  }

  render() {
    ChangeTitle('Create Video')
    const {seriesOptions, videoData, key, isLoadingVideo, showForm} = this.state
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
      seriesId = ''
    } = videoData
    return (
      <div key={key}>
        <h2>Video Detail</h2>
        <Divider />
        {!showForm && <Tab panes={[
          {menuItem: 'Brighcove', render: () => this._renderGetBrightcove()},
          {menuItem: 'Youtube', render: () => this._renderGetYoutube()},
          {menuItem: 'Vimeo', render: () => this._renderGetVimeo()},
        ]}/>}
        {/* <Segment.Group>
          <Segment>
            <Form>
              <Form.Input
                label='Brightcove ID'
                placeholder='Insert brightcove Id here'
                value={contentId}
                onChange={e => this.setState({contentId: e.target.value})}
              />
              <Button primary size='tiny' content='Load content' onClick={this._handleGetVideo}/>
            </Form>
          </Segment>
        </Segment.Group> */}
        {isLoadingVideo && <Segment><div><Loader active inline size='mini' /> &nbsp; Loading data</div></Segment>}
        {!showForm && <div style={{textAlign: 'right', marginTop: 15}}><button className='btn--transparent'><a style={{fontStyle: 'italic', cursor: 'pointer'}} onClick={(e) => {e.preventDefault(); this.setState({showForm: true})}}>Skip insert video id ?</a></button></div>}
        {showForm &&
        <div>
          <Segment.Group>
            <Segment>
              <h4>Thumbnails Video</h4>
            </Segment>
            <Segment>
              <ThumbnailsList onDataCallback={this._handleUpdateoriginalImages}/>

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
                          timeFormat={false}
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
                    <Divider />
                    <div>
                      <Button primary content='Create' onClick={this._handleVideoCreate}/>
                    </div>
                  </Form>
                </div>
              </div>
            </Segment>
          </Segment.Group>
        </div>
        }
      </div>
    )
  }
}
