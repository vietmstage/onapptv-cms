import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Loader, Icon} from 'semantic-ui-react'
export default class UploadFile extends Component {
  static propTypes = {
    typeMatch: PropTypes.string,
    onFileSelect: PropTypes.func
  }

  state = {
    fileName: '',
    typeMatch: '',
    loading: false
  }

  _handleChange = (e) => {
    const {onFileSelect} = this.props
    const {files} = e.target
    if (!files.length) return
    onFileSelect && onFileSelect(files[0])
    this.setState({fileName: files[0].name})
  }

  render() {
    const {typeMatch} = this.props
    const {fileName, loading} = this.state
    return (
      <div className='upload-file'>
        <label htmlFor='file'>
          {fileName === ''
            ? <span className='place-holder'>Choose a {typeMatch} file to upload...</span>
            : <span className='file-name'>{fileName}</span>
          }
          {loading
            ? <Loader active size='tiny' inverted />
            : <Icon name='ellipsis horizontal' size='large' />
          }
          <input
            id='file'
            type='file'
            accept={typeMatch}
            disabled={loading}
            onChange={this._handleChange}
          />
        </label>
        {loading ? <div className='overlap' /> : null}
      </div>
    )
  }
}
