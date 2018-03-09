import React, { Component } from 'react'
import { Segment, Form, Button, Divider, Icon, Modal, Table, Popup } from 'semantic-ui-react'
import DropDown from '../../components/common/Dropdown'
import DateTime from 'react-datetime'

export default class CreateVideo extends Component {
  state = {
    genresOptions: [
      {key: 'Action', value: 'Action', text: 'Action'},
      {key: 'Adventure', value: 'Adventure', text: 'Adventure'},
      {key: 'Comedy', value: 'Comedy', text: 'Comedy'},
      {key: 'Crime', value: 'Crime', text: 'Crime'},
      {key: 'Drama', value: 'Drama', text: 'Drama'},
      {key: 'Fantasy', value: 'Fantasy', text: 'Fantasy'},
    ],
    tagsOptions: [],
    directorOptions: [],
    castOptions: [],
    producerOptions: [],
    duration_in_seconds: 0,
    videoData: {},
    allowedCountriesOptions: [],
    modalOpen: false
  }
  _handleFileChange = (event) => {
    const {videoData} = this.state
    const {thumbnails = []} = videoData
    const {value, files} = event.target
    if (!value) return
    const formContent = {fileName: value}
    const reader = new window.FileReader()
    formContent.file = files[0]
    reader.readAsDataURL(files[0])
    reader.onload = () => {
      formContent.url = reader.result
      videoData.thumbnails = [
        ...thumbnails,
        {
          url: reader.result
        }
      ]
      this.setState({
        videoData
      })
    }
  }

  _handleThumbnailRemove = (index) => {
    const {videoData} = this.state
    videoData.thumbnails.splice(index, 1)
    this.setState({videoData})
  }

  _handleAddNewItem = (targetOptions, value) => {
    this.setState({
      [targetOptions]: [{ text: value, value }, ...this.state[targetOptions]],
    })
  }
  _handleArrayChange = (e, { name, value }) => this.setState({ [name]: value })

  _handleThumbnailNameChange = (index, value) => {
    const {videoData} = this.state
    videoData.thumbnails[index].name = value
    this.setState({videoData})
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
    const {episodeTitle, seasonIndex, episodeIndex} = this.state
    let {videoData} = this.state
    videoData.episodes = [
      ...(videoData.episodes || []),
      {
        title: episodeTitle,
        seasonIndex,
        episodeIndex
      }
    ]
    this.setState({
      videoData,
      episodeTitle: '',
      seasonIndex: '',
      episodeIndex: '',
      modalOpen: false
    })
  }

  _handleModalClose = () => {
    this.setState({
      episodeTitle: '',
      seasonIndex: '',
      episodeIndex: '',
      modalOpen: false
    })
  }

  _handleRemveEpisode = (index) => {
    let {videoData} = this.state
    videoData.episodes.splice(index, 1)
    this.setState({videoData})
  }

  render() {
    const {genresOptions, tagsOptions, directorOptions, castOptions, producerOptions, allowedCountriesOptions, videoData, modalOpen} = this.state
    const {
      title = '',
      thumbnails = [],
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
      episodes = []
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
            <div className='thumbnails-list'>
              <div>
                <div className='dropzone-wrapper'>
                  <label htmlFor='file' className='dropzone'>
                    <button><Icon name='plus'/></button>
                    <input id='file' accept='image/*' type='file' name='thumbnails' onChange={this._handleFileChange} className='input-file' style={{display: 'none'}}/>
                  </label>
                </div>
              </div>
              {thumbnails.map((thumb, index) => <div key={thumb.url+'_'+index} className='thumbnail-item'>
                <div className='thumbnail-img'>
                  <img src={thumb.url} alt=''/>
                  <div className='btn-close' onClick={() => this._handleThumbnailRemove(index)}><Icon name='close' /></div>
                </div>
                <div className="ui form">
                  <Form.Input
                    label='Thumbnail name:'
                    placeholder='Thumbnail name'
                    value={thumb.name || ''}
                    onChange={(e, {value}) => this._handleThumbnailNameChange(index, value)}
                  />
                </div>
              </div>)}
            </div>
          </Segment>
        </Segment.Group>

        <Segment.Group>
          <Segment><h4>Series detail</h4></Segment>
          <Segment>
            <div className='video-detail'>
            <div className="video__info">
                <Form>
                  <Form.Input
                    label='Title*'
                    placeholder='Video Title'
                    value={title}
                    name='title'
                    onChange={this._handleInputChange}
                  />
                  <Form.Input
                    label='Short Description'
                    placeholder='Short description'
                    value={shortDescription}
                    name='shortDescription'
                    onChange={this._handleInputChange}
                  />
                  <Form.TextArea
                    placeholder='Describe about video detail'
                    label='Description'
                    value={longDescription || ''}
                    name='longDescription'
                    onChange={this._handleInputChange}
                  />
                  <Form.Input
                    label='ContentId:'
                    placeholder='Content id of brightcove video'
                    value={contentId}
                    name='contentId'
                    onChange={this._handleInputChange}
                  />
                  <Form.Field>
                    <label>Genres:</label>
                    <DropDown
                      options={genresOptions}
                      name='genreIds'
                      placeholder='Choose genres'
                      search selection fluid multiple allowAdditions
                      value={genreIds}
                      onAddItem={(e, {value}) =>this._handleAddNewItem('genresOptions', value)}
                      onChange={this._handleInputChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Tags:</label>
                    <DropDown
                      options={tagsOptions}
                      name='tags'
                      placeholder='Choose tags'
                      search selection fluid multiple allowAdditions
                      value={tags}
                      onAddItem={(e, {value}) =>this._handleAddNewItem('tagsOptions', value)}
                      onChange={this._handleInputChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Director:</label>
                    <DropDown
                      name='directorIds'
                      options={directorOptions}
                      placeholder='Choose director'
                      search selection fluid multiple allowAdditions
                      value={directorIds}
                      onAddItem={(e, {value}) =>this._handleAddNewItem('directorOptions', value)}
                      onChange={this._handleInputChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Cast:</label>
                    <DropDown
                      name='castIds'
                      options={castOptions}
                      placeholder='Choose cast'
                      search selection fluid multiple allowAdditions
                      value={castIds}
                      onAddItem={(e, {value}) =>this._handleAddNewItem('castOptions', value)}
                      onChange={this._handleInputChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Producer:</label>
                    <DropDown
                      name='producerIds'
                      options={producerOptions}
                      placeholder='Choose producer'
                      search selection fluid multiple allowAdditions
                      value={producerIds}
                      onAddItem={(e, {value}) =>this._handleAddNewItem('producerOptions', value)}
                      onChange={this._handleInputChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Allowed Countries</label>
                    <DropDown
                      name='allowedCountries'
                      options={allowedCountriesOptions}
                      placeholder='Choose allowed countries'
                      search selection multiple fluid allowAdditions
                      value={allowedCountries}
                      onAddItem={(e, {value}) =>this._handleAddNewItem('allowedCountriesOptions', value)}
                      onChange={this._handleInputChange}
                    />
                  </Form.Field>
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
                    <Form>
                      <Form.Input
                        label='Title:'
                        placeholder='Episode name'
                        name='episodeTitle'
                        onChange={(e, {name, value}) => this.setState({[name]: value})}
                      />
                      <Form.Group widths='equal'>
                        <Form.Input
                          label='Season number:'
                          placeholder='Season number'
                          name='seasonIndex'
                          onChange={(e, {name, value}) => this.setState({[name]: value})}
                        />
                        <Form.Input
                          label='Episode number:'
                          placeholder='Episode number'
                          name='episodeIndex'
                          onChange={(e, {name, value}) => this.setState({[name]: value})}
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button onClick={this._handleModalClose}>
                      <Icon name='remove' /> Cancel
                    </Button>
                    <Button primary onClick={this._handleAddEpisode}>
                      <Icon name='checkmark' /> Add
                    </Button>
                  </Modal.Actions>
                </Modal>
              </div>
            </div>
          </Segment>
          <Segment>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell>Season</Table.HeaderCell>
                  <Table.HeaderCell>Episode Number</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {episodes.map((episode, index) => <Table.Row key={index}>
                  <Table.Cell>{episode.title}</Table.Cell>
                  <Table.Cell>{episode.seasonIndex}</Table.Cell>
                  <Table.Cell>{episode.episodeIndex}</Table.Cell>
                  <Table.Cell>
                    <div>
                      <Popup
                        trigger={<Button icon='trash' size='mini' onClick={() => this._handleRemveEpisode(index)} />}
                        content='Remove this episode'
                        inverted
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>)}
              </Table.Body>
            </Table>
          </Segment>
        </Segment.Group>
      </div>
    )
  }
}
