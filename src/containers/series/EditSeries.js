import React, { Component } from 'react'
import { Segment, Form, Button, Divider, Icon, Modal, Table, Popup, Dimmer, Loader } from 'semantic-ui-react'
import DateTime from 'react-datetime'
import ThumbnailsList from '../../components/ThumbnailsList'
import Genres from '../../components/selector/Genres'
import Tags from '../../components/selector/Tags'
import AllowedCountries from '../../components/selector/AllowedCountries'
import Description from '../../components/Description'
import People from '../../components/selector/People'
import { getSeriesById, updateSeries } from '../../actions/series';
import { toast } from 'react-toastify';
import VideoSearch from '../../components/VideoSearch'
import { updateSeriesId } from '../../actions/video';
import ChangeTitle from '../../libs/ChangeTitle';
import isEmpty from 'lodash/isEmpty'
export default class EditSeries extends Component {
  state = {
    videoData: {},
    modalOpen: false,
    key: '',
    episodes: {},
    loadingSeries: false,
    isPosting: false
  }

  
  componentWillMount () {
    const {match: {params: {seriesId}}} = this.props
    if (seriesId) {
      this.setState({loadingSeries: true})
      getSeriesById(seriesId).then(result => {
        if (result && !result.errors) {
          let episodes = {}
          if (result.data.episodes) result.data.episodes.map(ep => episodes[ep._id] = ep)
          this.setState({videoData: result.data, loadingSeries: false, episodes})
        } else {
          this.setState({loadingSeries: false})
          toast.error('Can not get series detail.')
        }
      })
    }
  }
  

  _handleInputChange = (e, {name, value}) => {
    let {videoData} = this.state
    videoData[name] = value
    this.setState({
      [name]: value,
      videoData
    })
  }

  _handleRemveEpisode = (id) => {
    let {episodes} = this.state
    delete episodes[id]
    // episodes.splice(index, 1)
    this.setState({episodes})
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

  _handleUpdateSeries = () => {
    const {videoData, episodes} = this.state
    this.setState({isPosting: true})
    delete videoData.episodes
    updateSeries(videoData).then(result => {
      this.setState({isPosting: false})
      if(result && !result.errors) {
        if(Object.keys(episodes).length) this._handleUpdateEpToSeries(result.data.recordId)
        else {
          toast.success('Update series success!')
          this.setState({
            videoData: {},
            key: new Date().getTime().toString(),
          })
        }
      } else {
        toast.error('Update series failed')
      }
    })
  }

  _handleUpdateEpToSeries = (seriesId) => {
    const {episodes} = this.state
    updateSeriesId(seriesId, Object.keys(episodes)).then(data => {
      if(!(data.errors && data.errors.length)) {
        toast.success('Update series success!')
        this.setState({
          videoData: {},
          key: new Date().getTime().toString(),
          episodes: []
        })
      } else {
        toast.error('Create failed')        
      }
    })
  }

  _handleGetEpisodesData = (episodes) => {
    console.log(episodes)
    this.setState({episodes})
  }

  _handleModalClose = () => {
    this.setState({modalOpen: false})
  }

  render() {
    ChangeTitle('Create Series')
    const {videoData, modalOpen, key, episodes, loadingSeries, isPosting} = this.state

    if (loadingSeries) return <div className='div__loading-full'><Dimmer inverted active><Loader /></Dimmer></div>    

    if (!loadingSeries && isEmpty(videoData)) return <Segment><i style={{color: '#999'}}>Sorry. There's nothing to show.</i></Segment>

    const {
      title = '',
      genreIds = [],
      tags = [],
      directorIds = [],
      castIds = [],
      producerIds = [],
      shortDescription = '',
      longDescription = '',
      publishDate = '',
      allowedCountries = [],
      contentId = '',
      originalImages = []
    } = videoData
    return (
      <div style={{position: 'relative'}}>
        {isPosting && <Dimmer active inverted><Loader /></Dimmer>}
        <h2>Series Detail</h2>
        <Divider />
        <Segment.Group>
          <Segment>
            <h4>Thumbnails Series</h4>
          </Segment>
          <Segment>
            <ThumbnailsList
              key={key}
              onDataCallback={this._handleUpdateoriginalImages}
              data={originalImages || []}
              isEdit 
            />
          </Segment>
        </Segment.Group>

        <Segment.Group>
          <Segment><h4>Series detail</h4></Segment>
          <Segment>
            <div className='video-detail'>
              <div className="video__info">
                <Form>
                  <Description
                    onDataCallback={this._handleUpdateDescription}
                    data={{title, shortDescription, longDescription}}
                  />
                  <Form.Input
                    label='ContentId:'
                    placeholder='Content id'
                    name='contentId'
                    value={contentId}
                    onChange={this._handleInputChange}
                  />

                  <Form.Group widths='equal'>
                    <Genres onDataCallback={this._handleUpdateGenres} genreIds={genreIds}/>
                      
                    <Tags onDataCallback={this._handleUpdateTags} tags={tags}/>
                  </Form.Group>

                  <People onDataCallback={this._handleUpdatePeople} data={{directorIds, castIds, producerIds}}/>
                  
                  <Form.Group widths='equal'>
                    <AllowedCountries onDataCallback={this._handleUdateCountries} allowedCountries={allowedCountries}/>

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

                    <Form.Field>
                      <label>End Date</label>
                      <DateTime
                        utc
                        timeFormat={false}
                        value={this.state.endDate || new Date()}
                        name='endDate'
                        // onChange={date => this._handleInputChange(null, {name: 'endDate', value: new Date(date)})}
                        closeOnSelect />
                    </Form.Field>
                  </Form.Group>
                </Form>
              </div>
            </div>
          </Segment>
        </Segment.Group>

        <Segment.Group>
          <Segment>
            <div className='clearfix'>
              <h4 className='left'>Episodes list</h4>
              <div className='right'>
                <Modal trigger={<Button size='mini' onClick={() => this.setState({modalOpen: true})}>Add episode to Series</Button>} size='small' open={modalOpen}>
                  <Modal.Header>Episode Detail</Modal.Header>
                  <Modal.Content>
                    <VideoSearch onDataCallback={this._handleGetEpisodesData} videosList={episodes}/>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button onClick={this._handleModalClose}>
                      <Icon name='checkmark' /> Done
                    </Button>
                    {/* <Button primary onClick={this._handleAddEpisode}>
                      <Icon name='checkmark' /> Add
                    </Button> */}
                  </Modal.Actions>
                </Modal>
              </div>
            </div>
          </Segment>
          <Segment>
            {!!Object.keys(episodes).length && <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{width: 90}}/>                  
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell>Episode Number</Table.HeaderCell>
                  <Table.HeaderCell style={{width: 80}}></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.keys(episodes).map((id, index) => {
                  const episode = episodes[id]
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>
                        <div style={{width: 70, height: 45, backgroundColor: 'rgba(0,0,0,0.15)'}}>
                          {!!episode.originalImages.length && <img
                            src={episode.originalImages && episode.originalImages[episode.originalImages.length - 1].url}
                            alt={(episode.originalImages && episode.originalImages[episode.originalImages.length - 1].name) || ''}
                            style={{width: 70, verticalAlign: 'top', objectFit: 'cover'}}
                          />}
                        </div>
                      </Table.Cell>
                      <Table.Cell>{episode.title}</Table.Cell>
                      <Table.Cell>{episode.shortDescription}</Table.Cell>
                      <Table.Cell>{episode.durationInSeconds}</Table.Cell>
                      <Table.Cell>
                        <div>
                          <Popup
                            trigger={<Button icon='trash' size='mini' onClick={() => this._handleRemveEpisode(id)} />}
                            content='Remove this episode'
                            inverted
                          />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>}
          </Segment>
        </Segment.Group>
        <div style={{textAlign: 'right'}}>
          <Button primary onClick={this._handleUpdateSeries}>Update</Button>
        </div>
      </div>
    )
  }
}
