import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Segment, Button, Divider, Form, Modal, Icon, Table, Popup, Dimmer, Loader } from 'semantic-ui-react'
import Description from '../../components/Description'
import ThumbnailsList from '../../components/ThumbnailsList'
import DropDown from '../../components/common/Dropdown'
import { getChannelById, channelAddEPGs, updateChannel, addEPG } from '../../actions/channel'
import {toast} from 'react-toastify'
import DateTime from 'react-datetime'
import findIndex from 'lodash/findIndex'
import debounce from 'lodash/debounce'
import {videoSearch} from '../../actions/video'
export default class EditChannel extends Component {
  static propTypes = {

  }

  state = {
    videoData: {},
    key: '',
    modalOpen: false,
    videoOptions: [],
    startTime: '',
    endTime: '',
    epgList: [],
    loadingChannel: false
  }

  componentWillMount () {
    const {match: {params: {channelId}}} = this.props
    if (channelId) {
      this.setState({loadingChannel: true})
      getChannelById(channelId).then(result => {
        if (result && !result.errors) {
          let epgList = []
          const {epgsData} = result.data
          epgsData.map(epg => epgList.push({
            videoId: epg.videoId,
            title: epg.videoData.title,
            startTime: epg.startTime,
            endTime: epg.endTime
          }))
          delete result.data.epgsData
          this.setState({videoData: result.data, loadingChannel: false, epgList})
        } else {
          this.setState({loadingChannel: false})
          toast.error('Can not get video detail.')
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

  _handleUpdateoriginalImages = (originalImages) => {
    this.setState({
      videoData: {
        ...this.state.videoData,
        originalImages
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

  _handleUpdate = () => {
    const {videoData} = this.state
    updateChannel(videoData).then(result => {
      if(!(result.errors && result.errors.length)) {
        this.props.history.push('/channel/list')
        toast.success('Update channel successfully!')
        this.setState({
          videoData: {},
          epgList: []
        })
      } else {
        toast.error('Update channel faield!!')
      }
    })
  }

  _handleModalClose = () => {
    this.setState({
      modalOpen: false,
      startTime: '',
      endTime: '',
      videoOptions: [],
      videoId: ''
    })
  }

  _handleSearchChange = (e, {searchQuery}) => {
    this._debounceSearch(searchQuery)
  }

  _debounceSearch = debounce((searchQuery) => {
    let options = []
    videoSearch(searchQuery).then(data => {
      if(data.items) {
        data.items.forEach(item => options.push({text: item.title, value: item._id}))
        this.setState({videoOptions: options})
      }
    })
  }, 500)

  _handleEPGAdd = () => {
    const {videoId, startTime, endTime, videoOptions, epgList} = this.state
    const index = findIndex(videoOptions, {'value': videoId})
    const title = videoOptions[index].text
    addEPG({
      videoId,
      startTime,
      endTime
    }).then(result => {
      if (result && !result.errors) {
        const {recordId} = result.data
        let {videoData} = this.state
        videoData.epgIds.push(recordId)
        epgList.push({
          videoId,
          startTime,
          endTime,
          title
        })
        this.setState({
          epgList,
          videoData
        }, this._handleModalClose)
      }
    })
  }

  _handleRemveEPG = (index) => {
    let {epgList, videoData} = this.state
    epgList.splice(index, 1)
    videoData.epgIds.splice(index, 1)
    this.setState({epgList, videoData})
  }

  // _handleChanelAddEPG = (channelId) => {
  //   let data = []
  //   const {epgList} = this.state
  //   epgList.forEach(item => {
  //     const {videoId, startTime, endTime} = item
  //     data.push({videoId, startTime, endTime})
  //   })

  //   channelAddEPGs(channelId, data).then(result => {
  //     if(!(result.errors && result.errors.length)) {
  //       toast.success('Create new channel successfully!')
  //       this.props.history.push('/channel/list')
  //       this.setState({
  //         videoData: {},
  //         key: new Date().getTime().toString(),
  //         epgList: []
  //       })
  //     } else {
  //       toast.error('Cannot add EPG list to channel')
  //     }
  //   })
  // }

  render() {
    const {videoData, modalOpen, videoOptions, videoId, startTime, endTime, epgList, loadingChannel} = this.state

    if (loadingChannel) return <div className='div__loading-full'><Dimmer active inverted><Loader /></Dimmer></div>

    const {
      title = '',
      shortDescription = '',
      longDescription = '',
      originalImages = []
    } = videoData
    return (
      <div>
        <h2>Update Channel</h2>
        <Divider />
        <Segment.Group>
          <Segment>
            <h4>Thumbnails Channel</h4>
          </Segment>
          <Segment>
            <ThumbnailsList onDataCallback={this._handleUpdateoriginalImages} data={originalImages} isEdit />
          </Segment>
        </Segment.Group>
        <Segment.Group>
          <Segment><h4>Channel info</h4></Segment>
          <Segment>
            <div className='video-detail'>
              <div className="video__info">
                <Form>
                  <Description
                    onDataCallback={this._handleUpdateDescription}
                    data={{title, shortDescription, longDescription}}
                  />
                </Form>
              </div>
            </div>
          </Segment>
        </Segment.Group>
        <Segment.Group>
          <Segment>
            <div className='clearfix'>
              <h4 className='left'>EPG list</h4>
              <div className='right'>
                <Modal
                  trigger={<Button size='mini'
                  onClick={() => this.setState({modalOpen: true})}>Add video to EPG</Button>}
                  size='small'
                  open={modalOpen}
                  // onClose={this._handleModalClose}
                >
                  <Modal.Header>Add video to EPG</Modal.Header>
                  <Modal.Content>
                    <Form>
                      <Form.Field>
                        <label>Video title:</label>
                        <DropDown
                          name='videoId'
                          selection search fluid
                          placeholder='Video title'
                          options={videoOptions}
                          onChange={(e, {name, value}) => this.setState({[name]: value})}
                          onSearchChange={this._handleSearchChange}
                          value={videoId}
                        />
                      </Form.Field>
                      <Form.Group widths='equal'>
                        <Form.Field>
                          <label>Start time:</label>
                          <DateTime
                            utc
                            value={startTime}
                            onChange={date => this.setState({startTime: new Date(date)})}
                            closeOnSelect />
                        </Form.Field>
                        <Form.Field>
                          <label>End time:</label>
                          <DateTime
                            utc
                            value={endTime}
                            onChange={date => this.setState({endTime: new Date(date)})}
                            closeOnSelect />
                        </Form.Field>
                      </Form.Group>
                    </Form>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button onClick={this._handleModalClose}>
                      <Icon name='close' /> Cancel
                    </Button>
                    <Button primary onClick={this._handleEPGAdd}>
                      <Icon name='checkmark' /> Add
                    </Button>
                  </Modal.Actions>
                </Modal>
              </div>
            </div>
          </Segment>
          {!!epgList.length && <Segment>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell>Start time</Table.HeaderCell>
                  <Table.HeaderCell>End time</Table.HeaderCell>
                  <Table.HeaderCell style={{width: 42}}></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {epgList.map((item, index) => <Table.Row key={item.videoId}>
                  <Table.Cell>{item.title}</Table.Cell>
                  <Table.Cell>{item.startTime.toString()}</Table.Cell>
                  <Table.Cell>{item.endTime.toString()}</Table.Cell>
                  <Table.Cell>
                    <div>
                      <Popup
                        trigger={<Button icon='trash' size='mini' onClick={() => this._handleRemveEPG(index)} />}
                        content='Remove this EPG'
                        inverted
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>)}
              </Table.Body>
            </Table>
          </Segment>}
        </Segment.Group>
        <div style={{textAlign: 'right'}}>
          <Button primary content='Update' onClick={this._handleUpdate}/>
        </div>
      </div>
    )
  }
}
