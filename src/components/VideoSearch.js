import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Divider, Input, Table, Button, Checkbox} from 'semantic-ui-react'
import {videoSearch} from '../actions/video'
export default class VideoSearch extends Component {
  static propTypes = {
    onDataCallback: PropTypes.func,
    selected: PropTypes.array
  }

  state = {
    isSearching: false,
    searchString: '',
    items: [],
    error: false,
    message: '',
    selected: []
  }

  componentDidMount () {
    const {selected} = this.props
    this.setState({
      selected: [...selected || []]
    })
  }

  _handleEnter = (e) => {
    if (e.keyCode === 13) this._handleSearch()
  }

  _handleSearch = () => {
    const {searchString} = this.state
    videoSearch(searchString, 30).then(data => {
      if(data && data.length) {
        this.setState({
          items: data
        })
      } else {
        this.setState({
          message: 'No data!'
        })
      }
    })
  }

  _handleSelect = (id) => {
    const {selected} = this.state
    const {onDataCallback} = this.props
    const index = selected.indexOf(id)
    if (index !== -1) selected.splice(index, 1)
    else selected.push(id)
    this.setState({selected}, () => onDataCallback && onDataCallback(this.state.selected))
  }

  render() {
    const {isSearching, searchString, selected, items} = this.state
    return (
      <div>
        <div>
          <div>
            <Input
              icon='search'
              loading={isSearching}
              style={{width: 250}}
              value={searchString}
              onKeyDown={this._handleEnter}
              onChange={(e, {value}) => this.setState({searchString: value})}
              placeholder='Enter search string...' />
            <Button primary content='Search' onClick={this._handleSearch}/>
          </div>
        </div>
        <Divider/>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Duration</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((item, index) =>
              <Table.Row
                className={selected.indexOf(item._id) !== -1 ? 'selected-row' : ''}
                key={index}
                onClick={() => this._handleSelect(item._id)}
              >
                <Table.Cell><Checkbox checked={selected.indexOf(item._id) !== -1} /></Table.Cell>
                <Table.Cell>{item.title}</Table.Cell>
                <Table.Cell>{item.shortDescription}</Table.Cell>
                <Table.Cell>{item.duration_in_second}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        {/* Pagination here */}
      </div>
    )
  }
}
