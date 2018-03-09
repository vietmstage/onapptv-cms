import React, { Component } from 'react'
import {Segment, Form, Button, Divider, Dimmer, Loader, Icon} from 'semantic-ui-react'
import DropDown from '../../components/common/Dropdown'
import { getVideoDetail, createVideo } from '../../actions/video'
import DateTime from 'react-datetime'
import {getImageSign, uploadImage} from '../../actions/image'
import isEmpty from 'lodash/isEmpty'
import { toast } from 'react-toastify';
import moment from 'moment'
import {getGenres, createGenre} from '../../actions/common'
import {Promise} from 'bluebird'

export default class CreateVideo extends Component {
  state = {
    contentId: '',
    videoSource: '',
    genresOptions: [],
    tagsOptions: [],
    directorOptions: [],
    castOptions: [],
    producerOptions: [],
    seriesOptions: [],
    seriesValue: '',
    duration_in_seconds: 0,
    videoData: {},
    allowedCountriesOptions: [],
    thumbnails: [],
    totalThumb: 0
  }

  componentDidMount () {
    getGenres().then(result => {
      if(!result) return
      const {genresOptions} = result.data.viewer
      this.setState({genresOptions: [...genresOptions]})
    })
  }

  _handleFileChange = (event) => {
    const {files} = event.target
    const _this = this
    if (files.length > 10) {
      toast.error('Maximum selected images are 10')
      return
    }
    this.setState({
      totalThumb: this.state.thumbnails.length + files.length
    })

    let p = Promise.resolve(true);

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      const imageName = file.name
      const type = file.type.split('/')[1]
      reader.onload = () => {
        p = p.then(() => getImageSign(imageName, type).then(result => {
          if (!result) return
          const {url} = result.data.admin.imageSignedUrl
          return Promise.resolve(uploadImage(url, file).then(resp => {
            if(resp.ok) {
              const tmp = url.split('?')[0].split('/')
              const urlFileName = tmp[tmp.length - 1]
              let img = new Image();
              img.onload = function () {
                _this.setState({
                  videoData: {
                    ..._this.state.videoData,
                    originalImage: [
                      ...(_this.state.videoData.originalImage || {}),
                      {
                        fileName: urlFileName,
                        width: this.width,
                        height: this.height
                      }
                    ]
                  }
                })
              };
              img.src = window.URL.createObjectURL(file);
              this.setState({
                thumbnails: [
                  ...this.state.thumbnails,
                  {
                    url: reader.result,
                  }
                ]
              })
            } else {
              this.setState({
                totalThumb: this.state.totalThumb - 1
              })
            }
          }))
        }))
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsDataURL(file);
    })

    // Promise.map(files, file => file).delay(500).each(file => {
    //   const reader = new FileReader();
    //   const imageName = file.name
    //   const type = file.type.split('/')[1]
    //   reader.onload = () => {
    //     getImageSign(imageName, type).then(result => {
    //       if (!result) return
    //       const {url} = result.data.admin.imageSignedUrl
    //       uploadImage(url, file).then(resp => {
    //         const tmp = url.split('?')[0].split('/')
    //         const urlImage = tmp[tmp.length - 1]
    //         this.setState({
    //           thumbnails: [
    //             ...this.state.thumbnails,
    //             {
    //               url: reader.result,
    //               name: 'xxxx'
    //             }
    //           ]
    //         })
    //       })
    //     })
    //   };
    //   reader.readAsDataURL(file)
    // })
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
        videoData
      })
    })
  }

  _handleVideoCreate = () => {
    const {videoData} = this.state
    createVideo(videoData).then(data => {
      if(data) {
        toast.success('Create video successfully!')
        this.setState({
          contentId: '',
          videoData: {},
          thumbnails: []
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

  _handleImageNameChange = (e, {value}) => {
    let {videoData} = this.state
    videoData.originalImage = {
      ...videoData.originalImage,
      name: value
    }

    this.setState({
      videoData
    })
  }

  _handleGenreCreate = (e, {value}) => {
    createGenre(value).then(result => {
      if(!result) return
      const {genresOptions, videoData} = this.state
      const {text, value} = result.data.admin.genreCreate.record
      let {genreIds} = videoData
      const index = genreIds.indexOf(text)
      genreIds.splice(index, 1)
      genreIds.push(value)
      this.setState({
        genresOptions: [
          ...genresOptions,
          {
            key: value,
            text,
            value
          }
        ],
        genreIds
      })
    })
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
    let {thumbnails, videoData, totalThumb} = this.state
    thumbnails.splice(index, 1)
    videoData.originalImage.splice(index, 1)
    this.setState({
      thumbnails,
      videoData,
      totalThumb: totalThumb - 1
    })
  }

  _handleThumbnailNameChange = (index, name) => {
    let {videoData} = this.state
    videoData.originalImage[index].name = name
    this.setState({
      videoData
    })
  }

  render() {
    const {contentId, genresOptions, tagsOptions, directorOptions, castOptions, producerOptions, seriesOptions, seriesValue, allowedCountriesOptions, videoData, thumbnails} = this.state
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
      originalImage = []
    } = videoData
    return (
      <div>
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
              <div className='thumbnails-list'>
                <div>
                  <div className='dropzone-wrapper'>
                    <label htmlFor='file' className='dropzone'>
                      <button><Icon name='plus'/></button>
                      <input id='file' accept='image/*' type='file' name='thumbnails' onChange={this._handleFileChange} className='input-file' style={{display: 'none'}} multiple/>
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
                      value={(originalImage && originalImage[index] && originalImage[index].name) || ''}
                      onChange={(e, {value}) => this._handleThumbnailNameChange(index, value)}
                    />
                  </div>
                </div>)}
                {this._renderTempThumb()}
              </div>
            </Segment>
          </Segment.Group>
          <Segment.Group>
            <Segment><h4>Brightcove video detail</h4></Segment>
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
                      value={shortDescription || ''}
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
                    <Form.Field>
                      <label>Genres:</label>
                      <DropDown
                        options={genresOptions}
                        name='genreIds'
                        placeholder='Choose genres'
                        search selection fluid multiple allowAdditions
                        value={genreIds}
                        onAddItem={this._handleGenreCreate}
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
                        // onChange={this._handleInputChange}
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
                        // onChange={this._handleInputChange}
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
                        // onChange={this._handleInputChange}
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
                          allowAdditions selection search fluid
                          placeholder='Video series'
                          options={seriesOptions}
                          onAddItem={(e, {value}) =>this._handleAddNewItem('seriesOptions', value)}
                          onChange={(e, {value}) => this.setState({seriesValue: value})}
                          value={seriesValue}
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
