import React, { Component } from 'react'
import {Segment, Button, Divider, Form} from 'semantic-ui-react'
import ThumbnailsList from '../../components/ThumbnailsList'
import Description from '../../components/Description'
import { channelCreate } from '../../actions/channel';
import { toast } from 'react-toastify';

export default class CreateChannel extends Component {
  state = {
    videoData: {},
    key: ''
  }

  _handleAddNewItem = (targetOptions, value) => {
    this.setState({
      [targetOptions]: [{ text: value, value }, ...this.state[targetOptions]],
    })
  }
  _handleArrayChange = (e, { name, value }) => this.setState({ [name]: value })

  _handleInputChange = (e, {name, value}) => {
    let {videoData} = this.state
    videoData[name] = value
    this.setState({
      [name]: value,
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

  _handleUpdateDescription = (data) => {
    this.setState({
      videoData: {
        ...this.state.videoData,
        ...data
      }
    })
  }
  
  _handleCreate = () => {
    const {videoData} = this.state
    channelCreate(videoData).then(data => {
      if(!(data.errors && data.errors.length)) {
        toast.success('Create new channel successfully!')
        this.setState({
          videoData: {},
          key: new Date().getTime().toString()
        })
      } else {
        toast.error('Create faield!!')
      }
    })
  }

  render() {
    const {videoData, key} = this.state
    const {
      title = '',
      shortDescription = '',
      longDescription = ''
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
            <ThumbnailsList onDataCallback={this._handleUpdateOriginalImage}/>
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
          <Segment>
            <div>
              <Button primary content='Create' onClick={this._handleCreate}/>
            </div>
          </Segment>
        </Segment.Group>
      </div>
    )
  }
}
