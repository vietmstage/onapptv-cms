import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form} from 'semantic-ui-react'
import debounce from 'lodash/debounce'
export default class Description extends Component {
  state = {
    title: '',
    shortDescription: '',
    longDescription: ''
  }
  static propTypes = {
    onDataCallback: PropTypes.func,
    data: PropTypes.object
  }

  componentDidMount () {
    this.setState({
      ...this.props.data
    })
  }
  
  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data) && JSON.stringify(nextProps.data) !== JSON.stringify(this.state)) {
      this.setState({
        ...nextProps.data
      })
    }
  }

  _handleInputChange = (e, {name, value}) => {
    this.setState({
      [name]: value
    }, this._callback)
  }

  _callback = debounce(() => {
    const {onDataCallback} = this.props
    onDataCallback && onDataCallback({...this.state})
  }, 300)

  render() {
    const {title, shortDescription, longDescription} = this.state
    return (
      <React.Fragment>
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
      </React.Fragment>
    )
  }
}
