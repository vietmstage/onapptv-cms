import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form} from 'semantic-ui-react'
import DropDown from '../common/Dropdown'
import {getGenres, createGenre} from '../../actions/common'
export default class Genres extends Component {
  static propTypes = {
    onDataCallback: PropTypes.func,
    genreIds: PropTypes.array
  }

  state = {
    genresOptions: [],
    genreIds: []
  }

  componentDidMount () {
    getGenres().then(result => {
      if(!result) return
      const {genresOptions} = result.data.viewer
      const {genreIds} = this.props
      this.setState({
        genresOptions: [...genresOptions],
        genreIds: [...(genreIds || [])]
      })
    })
  }

  componentWillReceiveProps (nextProps) {
    if(JSON.stringify(this.props.genreIds) !== JSON.stringify(nextProps.genreIds) && JSON.stringify(nextProps.genreIds) !== JSON.stringify(this.state.genreIds)) {
      this.setState({
        genreIds: [...(nextProps.genreIds || [])]
      })
    }
  }
  
  _handleGenreCreate = (e, {value}) => {
    const {onDataCallback} = this.props
    createGenre(value).then(result => {
      if(!result) return
      const {genresOptions, genreIds} = this.state
      const {text, value} = result.data.admin.genreCreate.record
      const index = genreIds.indexOf(text)
      if(index > -1) {
        genreIds.splice(index, 1)
      }
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
      }, () => onDataCallback && onDataCallback(this.state.genreIds))
    })
  }

  _handleInputChange = (e, {name, value}) => {
    const {onDataCallback} = this.props
    this.setState({
      [name]: value
    }, () => onDataCallback && onDataCallback(this.state.genreIds))
  }

  render() {
    const {genreIds, genresOptions} = this.state
    return (
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
    )
  }
}
