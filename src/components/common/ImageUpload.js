import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Icon} from 'semantic-ui-react'
import {toast} from 'react-toastify'
import {getImageSign, uploadImage} from '../../actions/image'
export default class ImageUpload extends Component {
  static propTypes = {
    multiple: PropTypes.bool,
    onUploadSuccess: PropTypes.func,
    onUploadFailed: PropTypes.func,
    onAcceptFiles: PropTypes.func,
    onLoadThumbnails: PropTypes.func
  }

  static defaultProps = {
    multiple: false
  }

  _handleFileChange = (event) => {
    const {files} = event.target
    const {onAcceptFiles, onUploadFailed, onUploadSuccess, onLoadThumbnails} = this.props

    if (files.length > 10) {
      toast.error('Maximum selected images are 10')
      return
    }

    // return accepted files from input
    onAcceptFiles && onAcceptFiles(files)    

    let p = Promise.resolve(true);

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      const imageName = file.name
      const type = file.type.split('/')[1]
      reader.onload = () => {
        p = p.then(() => getImageSign(imageName, type).then(result => {
          if (!result || result.errors) {
            onUploadFailed && onUploadFailed()
            return
          }
          const {url} = result.data
          return Promise.resolve(uploadImage(url, file).then(resp => {
            if(resp.ok) {
              const tmp = url.split('?')[0].split('/')
              const urlFileName = tmp[tmp.length - 1]
              let img = new Image();
              img.onload = function () {
                // return data upload image success
                onUploadSuccess && onUploadSuccess({
                  fileName: urlFileName,
                  width: this.width,
                  height: this.height
                })
              };
              img.src = window.URL.createObjectURL(file);

              // return data of thumbnails
              onLoadThumbnails && onLoadThumbnails({
                url: reader.result
              })
            } else {
              // upload failed - callback to reduce total image by 1
              onUploadFailed && onUploadFailed()
            }
          }))
        }))
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsDataURL(file);
    })
  }

  render() {
    const {multiple} = this.props
    return (
      <div className='dropzone-wrapper'>
        <label htmlFor='file' className='dropzone'>
          <button><Icon name='plus'/></button>
          <input id='file' accept='image/*' type='file' name='thumbnails' onChange={this._handleFileChange} className='input-file' style={{display: 'none'}} multiple={multiple}/>
        </label>
      </div>
    )
  }
}
