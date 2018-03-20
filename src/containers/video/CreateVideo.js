import React, { Component } from 'react'
import {Segment, Form, Button, Divider} from 'semantic-ui-react'
import DropDown from '../../components/common/Dropdown'
import { getVideoDetail, createVideo } from '../../actions/video'
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
    seriesValue: '',
    duration_in_seconds: 0,
    videoData: {},
    key: ''
  }

  _handleAddNewItem = (targetOptions, value) => {
    this.setState({
      [targetOptions]: [{ text: value, value }, ...this.state[targetOptions]],
    })
  }

  _handleGetVideo = () => {
    const {contentId} = this.state
    getVideoDetail(contentId).then(result => {
      if (!result) {
        toast.error('Can\'t get brightcove video detail')
        return
      }
      if (result.data.viewer.videoOne !== null) {
        toast.error('This video had created!')
        return
      }
      const data = result.data.viewer.brightcoveSearchVideo
      let videoData = {...data}
      delete videoData['__typename']

      this.setState({
        videoData,
        key: new Date().getTime().toString()
      })
    })
  }

  _handleVideoCreate = () => {
    const {videoData} = this.state
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

  _handleUpdateOriginalImage = (originalImage) => {
    this.setState({
      videoData: {
        ...this.state.videoData,
        originalImage
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

  render() {
    ChangeTitle('Create Video')
    const {contentId, seriesOptions, videoData, key} = this.state
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
      duration_in_seconds = 0,
      allowedCountries = [],
      seasonIndex = 0,
      episodeIndex = 0,
      seriesId = ''
    } = videoData
    return (
      <div key={key}>
        <h2>Video Detail</h2>
        <Divider />
        <Segment.Group>
          <Segment>
            <Form>
              <Form.Input
                label='Brightcove ID'
                placeholder='Fill brightcove Id here'
                value={contentId}
                onChange={e => this.setState({contentId: e.target.value})}
              />
              <Button primary size='tiny' content='Load content' onClick={this._handleGetVideo}/>
            </Form>
          </Segment>
        </Segment.Group>
        {!isEmpty(videoData) &&
        <div>
          <Segment.Group>
            <Segment>
              <h4>Thumbnails Video</h4>
            </Segment>
            <Segment>
              <ThumbnailsList onDataCallback={this._handleUpdateOriginalImage}/>

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
                    <Genres onDataCallback={this._handleUpdateGenres} genreIds={genreIds}/>
                    
                    <Tags onDataCallback={this._handleUpdateTags} tags={tags}/>

                    <People onDataCallback={this._handleUpdatePeople} data={{directorIds, castIds, producerIds}}/>
                    
                    <AllowedCountries onDataCallback={this._handleUdateCountries} allowedCountries={allowedCountries}/>
                    
                    <Form.Input
                      label='Duration in seconds'
                      placeholder='Duration in seconds'
                      value={duration_in_seconds}
                      name='duration_in_seconds'
                      onChange={(e, {name, value}) => this._handleInputChange(e, {name, value: parseFloat(value, 10)})}                    
                    />
                    <Form.Field>
                      <label>Publish Date</label>
                      <DateTime
                        utc
                        timeFormat={false}
                        value={publishDate}
                        name='publishDate'
                        onChange={date => this._handleInputChange(null, {name: 'publishDate', value: new Date(date)})}
                        closeOnSelect />
                    </Form.Field>
                    <Form.Field>
                      <label>Type</label>
                      <DropDown
                        selection
                        options={[
                          {key: 0, value: 'standalone', text: 'Standalone'},
                          {key: 1, value: 'episode', text: 'Episode'}
                        ]}
                        placeholder='Select video type'
                        name='type'
                        value={type}
                        onChange={this._handleInputChange}
                      />
                    </Form.Field>
                    {type === 'episode' && <div>
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
