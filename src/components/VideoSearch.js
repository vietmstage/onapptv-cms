import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Divider, Input, Table, Button, Checkbox} from 'semantic-ui-react'
import {videoSearch} from '../actions/video'
export default class VideoSearch extends Component {
  static propTypes = {
    onDataCallback: PropTypes.func,
    videosList: PropTypes.object
  }

  state = {
    isSearching: false,
    searchString: '',
    total: 0,
    items: [],
    error: false,
    message: '',
    selected: {}
  }

  componentDidMount () {
    const {videosList} = this.props
    this.setState({
      selected: {...videosList || []}
    })
  }

  _handleEnter = (e) => {
    if (e.keyCode === 13) this._handleSearch()
  }

  _handleSearch = () => {
    const {searchString} = this.state
    this.setState({
      isSearching: true
    })
    videoSearch(searchString, 30).then(data => {
      console.log('data', data)
      this.setState({isSearching: false})
      if(data && !data.error) {
        const {count, items} = data
        this.setState({
          total: count,
          items
        })
      } else {
        this.setState({
          message: 'No data!'
        })
      }
    })
  }

  _handleSelect = (item) => {
    let {selected} = this.state
    const {onDataCallback} = this.props
    const {_id: id} = item
    const keys = Object.keys(selected)
    const index = keys.indexOf(id)
    if (index !== -1) delete selected[id]
    else selected = {...selected, [id]: item}
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
            {/* <Button primary content='Search' onClick={this._handleSearch}/> */}
          </div>
        </div>
        <Divider/>
        {items.length === 0 && <div>Sorry. There's nothing to show.</div>}
        {!!items.length && <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{width: 42}}></Table.HeaderCell>
              <Table.HeaderCell style={{width: 90}}/>              
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Duration</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((item, index) =>
              <Table.Row
                className={Object.keys(selected).indexOf(item._id) !== -1 ? 'selected-row' : ''}
                key={index}
                onClick={() => this._handleSelect(item)}
              >
                <Table.Cell><Checkbox checked={Object.keys(selected).indexOf(item._id) !== -1} /></Table.Cell>
                <Table.Cell>
                  <div style={{width: 70, height: 45, backgroundColor: 'rgba(0,0,0,0.15)'}}>
                    {item.originalImages && !!item.originalImages.length && <img
                      src={item.originalImages && item.originalImages[item.originalImages.length - 1].url}
                      alt={(item.originalImages && item.originalImages[item.originalImages.length - 1].name) || ''}
                      style={{width: 70, verticalAlign: 'top', objectFit: 'cover'}}
                    />}
                  </div>
                </Table.Cell>
                <Table.Cell>{item.title}</Table.Cell>
                <Table.Cell>{item.shortDescription}</Table.Cell>
                <Table.Cell>{item.durationInSeconds}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>}
        {/* Pagination here */}
      </div>
    )
  }
}
