import React, { Component } from 'react'
import {Segment, Button, Divider, Form, Modal, Icon, Table, Popup} from 'semantic-ui-react'
import ThumbnailsList from '../../components/ThumbnailsList'
import Description from '../../components/Description'
import { channelCreate, channelAddEPGs, addEPG, updateChannel } from '../../actions/channel';
import { toast } from 'react-toastify';
import ChangeTitle from '../../libs/ChangeTitle';
import DropDown from '../../components/common/Dropdown';
import debounce from 'lodash/debounce'
import { videoSearch } from '../../actions/video'
import DateTime from 'react-datetime'
import findIndex from 'lodash/findIndex'
export default class CreateChannel extends Component {
  state = {
    videoData: {},
    key: '',
    modalOpen: false,
    videoOptions: [],
    startTime: '',
    endTime: '',
    epgList: [],
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
  
  _handleCreate = () => {
    const {videoData, epgList} = this.state
    channelCreate(videoData).then(result => {
      if(!(result.errors && result.errors.length)) {
        if(epgList.length) {
          this._handleChanelAddEPG(result.data.admin.channelCreate.recordId)
        } else {
          toast.success('Create new channel successfully!')
          this.props.history.push('/channel/list')          
          this.setState({
            videoData: {},
            key: new Date().getTime().toString()
          })
        }
      } else {
        toast.error('Create faield!!')
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

  // _handleEPGAdd = () => {
  //   const {videoId, startTime, endTime, videoOptions, epgList} = this.state
  //   const index = findIndex(videoOptions, {'value': videoId})
  //   const title = videoOptions[index].text
  //   addEPG({
  //     videoId,
  //     startTime,
  //     endTime
  //   }).then(result => {
  //     if (result && !result.errors) {
  //       const {recordId} = result.data
  //       // let {videoData} = this.state
  //       // videoData.epgIds.push(recordId)
  //       epgList.push({
  //         id: recordId,
  //         videoId,
  //         startTime,
  //         endTime,
  //         title
  //       })
  //       this.setState({
  //         epgList
  //       }, this._handleModalClose)
  //     }
  //   })
  //   // epgList.push({
  //   //   videoId,
  //   //   startTime,
  //   //   endTime,
  //   //   title
  //   // })
  //   // this.setState({
  //   //   epgList
  //   // }, this._handleModalClose)
  // }

  // _handleRemveEPG = (index) => {
  //   let {epgList, videoData} = this.state
  //   epgList.splice(index, 1)
  //   videoData.epgIds.splice(index, 1)
  //   this.setState({epgList, videoData})
  // }

  // _handleChanelAddEPG = (channelId) => {
  //   // let data = {_id: channelId, epgIds: []}
  //   let epgIds = []
  //   const {epgList} = this.state
  //   epgList.forEach(item => epgIds.push(item.id))

  //   // updateChannel(data).then(result => {
  //   //   if(result && !result.errors) {
  //   //     toast.success('Update channel successfully!')
  //   //     this.setState({
  //   //       videoData: {},
  //   //       key: new Date().getTime().toString(),
  //   //       epgList: []
  //   //     })
  //   //   } else {
  //   //     toast.error('Update failed')
  //   //   }
  //   // })
  //   channelAddEPGs(channelId, epgIds).then(result => {
  //     if(result && !result.errors) {
  //       this.props.history.push('/channel/list')
  //       toast.success('Create new channel successfully!')
  //       this.setState({
  //         videoData: {},
  //         key: new Date().getTime().toString(),
  //         epgList: []
  //       })
  //     } else {
  //       toast.error('Create new channel failed')
  //     }
  //   })
  // }

  render() {
    ChangeTitle('Create Channel')
    const {videoData, key, modalOpen, videoOptions, videoId, startTime, endTime, epgList} = this.state
    const {
      title = '',
      shortDescription = '',
      longDescription = '',
      serviceId = '',
      lcn = ''
    } = videoData
    return (
      <div key={key}>
        <h2>Channel Detail</h2>
        <Divider />
        <Segment.Group>
          <Segment>
            <h4>Thumbnails Channel</h4>
          </Segment>
          <Segment>
            <ThumbnailsList onDataCallback={this._handleUpdateoriginalImages}/>
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
                  <Form.Group widths='equal'>
                    <Form.Input
                      label='Service Id'
                      placeholder='Service Id'
                      name='serviceId'
                      value={serviceId}
                      onChange={this._handleInputChange}
                    />
                    <Form.Input
                      label='Logic Channel Number'
                      placeholder='Logic Channel Number'
                      name='lcn'
                      value={lcn}
                      onChange={this._handleInputChange}
                    />
                  </Form.Group>
                </Form>
              </div>
            </div>
          </Segment>
        </Segment.Group>
        {/* <Segment.Group>
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
        </Segment.Group> */}
        <div style={{textAlign: 'right'}}>
          <Button primary content='Create' onClick={this._handleCreate}/>
        </div>
      </div>
    )
  }
}
