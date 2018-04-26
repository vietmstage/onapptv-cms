import React, { Component } from 'react'
import {adsSearch, getAds} from '../../actions/ads'
import {toast} from 'react-toastify'
import ChangeTitle from '../../libs/ChangeTitle';
import {Segment, Table, Input, Button, Popup, Checkbox, Dimmer, Loader} from 'semantic-ui-react'
import Pagination from '../../components/common/Pagination'
import { Link } from 'react-router-dom'

export default class AdsList extends Component {
  state = {
    isSearching: false,
    confirmedSearchString: '',
    searchString: '',
    activePage: 1,
    pageSize: 20,
    items: [],
    total: 0,
    selected: []
  }

  componentDidMount () {
    if (this.props.match.params.page) {
      this.setState({activePage: parseInt(this.props.match.params.page, 10) || 1}, this._handleGetAds)
    } else {
      this._handleGetAds()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.page !== nextProps.match.params.page) {
      this.setState({activePage: parseInt(nextProps.match.params.page, 10) || 1}, this._handleGetAds)
    }
  }
  
  _handleGetAds = () => {
    const {activePage, pageSize, confirmedSearchString} = this.state
    this.setState({isLoading: true})
    if (confirmedSearchString.length !== 0) {
      adsSearch({text: confirmedSearchString, limit: pageSize, skip: (activePage - 1) * pageSize}).then(data => {
        this.setState({
          isSearching: false,
          isLoading: false
        })
        if(!data || data.errors) {
          toast.error('Cannot search ads!')
          return
        }
        const {items, count} = data
        this.setState({
          items,
          total: count,
          selected: []
        })
      })
      return
    }
    getAds(activePage, pageSize).then(result => {
      this.setState({
        isSearching: false,
        isLoading: false
      })
      if(!result || result.errors) return
      const {items, count} = result.data.viewer.data
      this.setState({
        items,
        total: count,
        selected: []
      })
    })
  }

  _handleEnter = (e) => {
    if (e.keyCode === 13) this._handleSearch()
  }

  _handleSearch = () => {
    const {searchString} = this.state
      this.setState({confirmedSearchString: searchString, activePage: 1, isSearching: true}, this._handleGetAds)
  }

  _changePageSize = (e, data) => {
    this.setState({pageSize: data.value}, this._handleGetAds)
  }

  _handleSelect = (id) => {
    const {selected} = this.state
    const index = selected.indexOf(id)
    if (index !== -1) selected.splice(index, 1)
    else selected.push(id)
    this.setState({selected})
  }

  _handleSelectAll = (items) => {
    const {selected} = this.state
    if (selected.length >= items.length) this.setState({selected: []})
    else {
      const newSelected = items.map(item => item._id)
      this.setState({selected: newSelected})
    }
  }

  render() {
    ChangeTitle('Ads List')
    const {history} = this.props
    const {searchField, isSearching, searchString, activePage, items, total, pageSize, selected, isLoading} = this.state
    return (
      <div>
        <Segment.Group>
          <Segment color='blue'>
            <h2>Ads List</h2>
            <div className="flex-box">
              <div>
                {/* <DropDown
                  value={searchField}
                  style={{width: 120, marginRight: 5}}
                  compact
                  selection
                  onChange={(e, {value}) => this.setState({searchField: value})}
                  options={[
                    {key: 0, value: 'title', text: 'Title'},
                    {key: 1, value: 'desciption', text: 'Desciption'},
                    {key: 2, value: 'type', text: 'Type'},
                  ]}
                /> */}
                <Input
                  icon='search'
                  loading={isSearching}
                  style={{width: 250}}
                  value={searchString}
                  onKeyDown={this._handleEnter}
                  onBlur={this._handleSearch}
                  onChange={(e, {value}) => this.setState({searchString: value})}
                  placeholder='Enter search string...' />
              </div>
              <div>
                {items.length > 0 && <Button
                  size='tiny'
                  content='Archive selected ads'
                  negative
                  disabled={selected.length === 0}
                  onClick={() => this.setState({showBulkConfirm: true})} />}
                <Button
                  size='tiny'
                  primary
                  content='Add ads'
                  as={Link}
                  to='/ads/add' />
              </div>
            </div>
          </Segment>
          {items.length === 0 && <Segment>
            {isLoading ? <div><Loader active inline size='mini' /> &nbsp; Loading data</div>
              : <i style={{color: '#999'}}>
                Sorry. There's nothing to show.
              </i>}
          </Segment>
          }
        </Segment.Group>
        {!!items.length && <div style={{position: 'relative'}}>
          {isLoading && <Dimmer active inverted><Loader /></Dimmer>}
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{width: 50}}>
                  <Checkbox
                    checked={selected.length === items.length}
                    indeterminate={selected.length < items.length && selected.length > 0}
                    onClick={() => this._handleSelectAll(items)}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell style={{width: 90}}></Table.HeaderCell>
                <Table.HeaderCell>Deal</Table.HeaderCell>
                <Table.HeaderCell>Url</Table.HeaderCell>
                <Table.HeaderCell>Created At</Table.HeaderCell>
                <Table.HeaderCell style={{width: 76}}>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.map((item, index) => {
                return (
                  <Table.Row
                    key={index}
                    className={selected.indexOf(item._id) !== -1 ? 'selected-row' : ''}
                    onClick={() => this._handleSelect(item._id)}
                  >
                    <Table.Cell><Checkbox checked={selected.indexOf(item._id) !== -1} /></Table.Cell>
                    <Table.Cell>
                      <div>
                        {item.originalImages && <img
                          src={item.originalImages && item.originalImages.url}
                          alt={(item.originalImages && item.originalImages.name) || ''}
                          style={{width: 70, height: 45, verticalAlign: 'top', objectFit: 'cover'}}
                        />}
                      </div>
                    </Table.Cell>
                    <Table.Cell><Link to={`/ads/edit/${item._id}`}>{item.deal}</Link></Table.Cell>
                    <Table.Cell><a href={item.url || '/'} target='_blank'>{item.url}</a></Table.Cell>
                    <Table.Cell>{item.createdAt}</Table.Cell>
                    <Table.Cell>
                      <div>
                        <Popup
                          trigger={<Button icon='edit' size='mini' as={Link} to={`/ads/edit/${item._id}`} />}
                          content='Edit this ads.'
                          inverted
                        />
                        <Popup
                          trigger={<Button icon='trash' size='mini' onClick={(e) => this._showConfirm({}, e)} />}
                          content='Archive this ads.'
                          inverted
                        />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
          <div style={{textAlign: 'right'}}>
            <Pagination
              currentPage={activePage}
              pageSize={pageSize}
              total={total}
              history={history}
              onchangeSize={this._changePageSize}
              url='/ads/list' />
          </div>
        </div>}
      </div>
    )
  }
}
