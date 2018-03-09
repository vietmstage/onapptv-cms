import React, { Component } from 'react'
import {Segment, Form, Button, Divider, Icon} from 'semantic-ui-react'
import DropDown from '../../components/common/Dropdown'
import DateTime from 'react-datetime'

export default class CreateChannel extends Component {
  state = {
    videoData: {},
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

  render() {
    const {videoData} = this.state
    const {
      title = '',
      thumbnails = [],
      shortDescription = '',
      longDescription = '',
      contentId = ''
    } = videoData
    return (
      <div>
        <h2>Channel Detail</h2>
        <Divider />
        <Segment.Group>
          <Segment>
            <h4>Thumbnails Channel</h4>
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
          <Segment><h4>Channel info</h4></Segment>
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
                </Form>
              </div>
            </div>
          </Segment>
          <Segment>
            <div>
              <Button primary content='Create'/>
            </div>
          </Segment>
        </Segment.Group>
      </div>
    )
  }
}
