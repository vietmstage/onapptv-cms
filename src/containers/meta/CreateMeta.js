import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {Segment, Form, Button} from 'semantic-ui-react'
import ChangeTitle from '../../libs/ChangeTitle';
import UploadFile from '../../components/common/UploadFile'
import {toast} from 'react-toastify'
import { getFileSign, uploadFile, fileCreate } from '../../actions/meta';
export default class CreateMeta extends Component {
  static propTypes = {

  }

  state = {
    version: '',
    file: {},
    loading: false,
    key: 0
  }

  _handleChange = (e, {name, value}) => {
    this.setState({
      [name]: value
    })
  }

  _handleSubmit = e => {
    e.preventDefault()
    const {version, file} = this.state

    if (!file.name) {
      toast.error('Please choose file.')
      return
    }

    if (!version) {
      toast.error('Please insert file version')
      return
    }
    const pos = file.name.lastIndexOf('.')
    const ext = file.name.split('.').pop()
    const fileName = file.name.slice(0, pos)
    this.setState({loading: true})
    getFileSign({
      fileName,
      contentType: ext,
      version,
    }).then(result => {
      if (result && !result.errors) {
        const {url} = result.data
        uploadFile({
          url,
          file
        }).then(resp => {
          if (resp.ok) {
            fileCreate({
              name: file.name,
              version,
            }).then(result => {
              if (result && !result.errors) {
                toast.success('Upload file successfully.')
                this.setState({
                  loading: false,
                  file: {},
                  version: '',
                  key: this.state.key + 1
                })
              } else {
                this._handleError('Cannot upload file.')
              }
            })
          } else {
            this._handleError('Cannot post file to s3 server.')
          }
        })
      } else {
        this._handleError('Cannot get file signed url.')
      }
    })
    
  }

  _handleError = (text) => {
    toast.error(text)
    this.setState({loading: false})
  }

  _handleFileSelect = (file) => {
    this.setState({file})
  }

  render() {
    ChangeTitle('Meta Setting')
    const {loading, key, version} = this.state
    return (
      <div className='main-content' key={key}>
        <h2>Meta Setting</h2>
        <Segment.Group>
          <Segment>
            <h3>Upload file</h3>
          </Segment>
          <Segment>
            <Form onSubmit={this._handleSubmit}>
              <Form.Group>
                <Form.Field style={{width: '100%'}}>
                  <label>Choose file:</label>
                  <UploadFile onFileSelect={this._handleFileSelect}/>
                </Form.Field>
                <Form.Input
                  label='File Version'
                  placeholder='File Version'
                  name='version'
                  value={version}
                  onChange={this._handleChange}
                  type='number'
                />
              </Form.Group>
              <Form.Field style={{textAlign: 'right'}}>
                <Button type='submit' content='Upload file' primary size='mini' loading={loading}/>
              </Form.Field>
            </Form>
          </Segment>
        </Segment.Group>
      </div>
    )
  }
}
