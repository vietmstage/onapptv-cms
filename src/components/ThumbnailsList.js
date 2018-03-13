import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImageUpload from './common/ImageUpload'
import {Form, Dimmer, Loader, Icon} from 'semantic-ui-react'
export default class ThumbnailsList extends Component {
  static propTypes = {
    onDataCallback: PropTypes.func
  }

  state = {
    totalThumb: 0,
    thumbnails: [],
    thumbnailsData: []
  }

  _renderTempThumb = () => {
    const {totalThumb, thumbnails} = this.state
    const array = []
    for (let i = 0; i < (totalThumb - thumbnails.length); i++) {
      array.push(
        <div key={i} className='thumbnail-item thumbnail--loading'>
          <div className='thumbnail-img'>
            <Dimmer active inverted><Loader /></Dimmer>
          </div>
        </div>
      )
    }
    return array
  }

  _handleThumbnailRemove = (index) => {
    let {thumbnails, totalThumb, thumbnailsData} = this.state
    thumbnails.splice(index, 1)
    thumbnailsData.splice(index, 1)
    this.setState({
      thumbnails,
      thumbnailsData,
      totalThumb: totalThumb - 1
    }, this._dataCallback)
  }

  _handleThumbnailNameChange = (index, name) => {
    let {thumbnailsData} = this.state
    thumbnailsData[index].name = name
    this.setState({
      thumbnailsData
    }, this._dataCallback)
  }

  _handleAcceptFiles = (files) => {
    console.log(files)
    this.setState({
      totalThumb: this.state.thumbnails.length + files.length
    })
  }

  _handleUploadSuccess = (data) => {
    console.log(data)
    const {thumbnailsData} = this.state
    this.setState({
      thumbnailsData: [
        ...thumbnailsData,
        data
      ]
    }, this._dataCallback)
  }

  _handleUploadFailed = () => {
    console.log("Upload failed")
    this.setState({
      totalThumb: this.state.totalThumb - 1
    })
  }

  _hanleLoadThumbnails = (thumbnail) => {
    this.setState({
      thumbnails: [
        ...this.state.thumbnails,
        thumbnail
      ]
    })
  }

  _dataCallback = () => {
    const {onDataCallback} = this.props
    const {thumbnailsData} = this.state
    onDataCallback && onDataCallback(thumbnailsData)
  }

  render() {
    const {thumbnails, thumbnailsData} = this.state
    return (
      <div className='thumbnails-list'>
        <div>
          <ImageUpload
            multiple
            onAcceptFiles={this._handleAcceptFiles}
            onUploadSuccess={this._handleUploadSuccess}
            onUploadFailed={this._handleUploadFailed}
            onLoadThumbnails={this._hanleLoadThumbnails}
          />
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
              value={(thumbnailsData && thumbnailsData[index] && thumbnailsData[index].name) || ''}
              onChange={(e, {value}) => this._handleThumbnailNameChange(index, value)}
            />
          </div>
        </div>)}
        {this._renderTempThumb()}
      </div>
    )
  }
}
