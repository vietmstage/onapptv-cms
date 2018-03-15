import React, { Component } from 'react'
import { Segment, Form, Button, Divider, Icon, Modal, Table, Popup } from 'semantic-ui-react'
import DateTime from 'react-datetime'
import ThumbnailsList from '../../components/ThumbnailsList'
import Genres from '../../components/selector/Genres'
import Tags from '../../components/selector/Tags'
import AllowedCountries from '../../components/selector/AllowedCountries'
import Description from '../../components/Description'
import People from '../../components/selector/People'
import { seriesCreate } from '../../actions/series';
import { toast } from 'react-toastify';
import VideoSearch from '../../components/VideoSearch'
import { updateSeriesId } from '../../actions/video';
import ChangeTitle from '../../libs/ChangeTitle';
export default class CreateSeries extends Component {
  state = {
    videoData: {},
    modalOpen: false,
    key: '',
    episodes: {}
  }

  _handleInputChange = (e, {name, value}) => {
    let {videoData} = this.state
    videoData[name] = value
    this.setState({
      [name]: value,
      videoData
    })
  }

  _handleAddEpisode = () => {
  //   const {episodeTitle, seasonIndex, episodeIndex} = this.state
  //   let {episodes} = this.state
  //   episodes = [
  //     ...(episodes || []),
  //     {
  //       title: episodeTitle,
  //       seasonIndex,
  //       episodeIndex
  //     }
  //   ]
  //   this.setState({
  //     episodes,
  //     episodeTitle: '',
  //     seasonIndex: '',
  //     episodeIndex: '',
  //     modalOpen: false
  //   })
  // }

  // _handleModalClose = () => {
  //   this.setState({
  //     episodeTitle: '',
  //     seasonIndex: '',
  //     episodeIndex: '',
  //     modalOpen: false
  //   })
  }

  _handleRemveEpisode = (id) => {
    let {episodes} = this.state
    delete episodes[id]
    // episodes.splice(index, 1)
    this.setState({episodes})
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

  _handleCreate = () => {
    const {videoData, episodes} = this.state
    seriesCreate(videoData).then(data => {
      if(!(data.errors && data.errors.length)) {
        if(Object.keys(episodes).length) this._handleUpdate(data.data.admin.seriesCreate.recordId)
        else {
          toast.success('Create new series success!')
          this.setState({
            videoData: {},
            key: new Date().getTime().toString(),
          })
        }
      } else {
        toast.error('Create failed')
      }
    })
  }

  _handleUpdate = (seriesId) => {
    const {episodes} = this.state
    updateSeriesId(seriesId, Object.keys(episodes)).then(data => {
      if(!(data.errors && data.errors.length)) {
        toast.success('Create new series success!')
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
    const {videoData, modalOpen, key, episodes} = this.state
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
      contentId = ''
    } = videoData
    return (
      <div>
        <h2>Series Detail</h2>
        <Divider />
        <Segment.Group>
          <Segment>
            <h4>Thumbnails Series</h4>
          </Segment>
          <Segment>
            <ThumbnailsList
              key={key}
              onDataCallback={this._handleUpdateOriginalImage}
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
                  <Genres onDataCallback={this._handleUpdateGenres} genreIds={genreIds}/>
                    
                  <Tags onDataCallback={this._handleUpdateTags} tags={tags}/>

                  <People onDataCallback={this._handleUpdatePeople} data={{directorIds, castIds, producerIds}}/>

                  <AllowedCountries onDataCallback={this._handleUdateCountries} allowedCountries={allowedCountries}/>

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
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell>Season</Table.HeaderCell>
                  <Table.HeaderCell>Episode Number</Table.HeaderCell>
                  <Table.HeaderCell style={{width: 80}}></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.keys(episodes).map((id, index) => {
                  const episode = episodes[id]
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>{episode.title}</Table.Cell>
                      <Table.Cell>{episode.shortDescription}</Table.Cell>
                      <Table.Cell>{episode.duration_in_seconds}</Table.Cell>
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
          <Button primary onClick={this._handleCreate}>Create</Button>
        </div>
      </div>
    )
  }
}
