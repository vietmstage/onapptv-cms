import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form} from 'semantic-ui-react'
import DropDown from '../common/Dropdown'

export default class Tags extends Component {
  static propTypes = {
    onDataCallback: PropTypes.func,
    tags: PropTypes.array
  }

  state = {
    tagsOptions: [],
    tags: []
  }

  componentDidMount () {
    const {tags} = this.props
    this.setState({
      tags: [...(tags || [])]
    })
    this._buildTagsOptionsData(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if(JSON.stringify(this.props.tags) !== JSON.stringify(nextProps.tags) && JSON.stringify(nextProps.tags) !== JSON.stringify(this.state.tags)) {
      this._buildTagsOptionsData(nextProps)
      this.setState({
        tags: [...(nextProps.tags || [])]
      })
    }
  }

  _buildTagsOptionsData(props) {
    if (props.tags && props.tags.length && this.state.tagsOptions.length === 0) {
      let options = []
      props.tags.map(tag => options.push({text: tag, value: tag}))
      this.setState({
        tagsOptions: options
      })
    }
  }

  _handleAddNewItem = (targetOptions, value) => {
    this.setState({
      [targetOptions]: [{ text: value, value }, ...this.state[targetOptions]],
    })
  }

  _handleInputChange = (e, {name, value}) => {
    const {onDataCallback} = this.props
    this.setState({
      [name]: value
    }, () => onDataCallback && onDataCallback(this.state.tags))
  }

  render() {
    const {tagsOptions, tags} = this.state
    return (
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
    )
  }
}
