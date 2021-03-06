import React, { Component } from 'react'
import ChangeTitle from '../../libs/ChangeTitle'
import { Table, Segment, Input, Button, Popup, Checkbox, Loader, Dimmer, Confirm } from 'semantic-ui-react'
import DropDown from '../../components/common/Dropdown'
import { Link } from 'react-router-dom'
// import {connect} from 'react-redux'
import Pagination from '../../components/common/Pagination'
import { getSeries, seriesSearch, updateSeriesMany } from '../../actions/series';
import {toast} from 'react-toastify'
export default class ArchivedSeriesList extends Component {
  state = {
    searchField: 'title',
    isSearching: false,
    searchString: '',
    activePage: 1,
    pageSize: 20,
    items: [],
    total: 0,
    confirmedSearchString: '',
    selected: [],
    isLoading: true,
    archivedItem: {},
    isArchivingIds: [],
    showConfirm: false,
    showBulkConfirm: false
  }

  componentDidMount () {
    if (this.props.match.params.page) {
      this.setState({activePage: parseInt(this.props.match.params.page, 10) || 1}, this._handleGetSeries)
    } else {
      this._handleGetSeries()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.page !== nextProps.match.params.page) {
      this.setState({activePage: parseInt(nextProps.match.params.page, 10) || 1}, this._handleGetSeries)
    }
  }

  _handleGetSeries = () => {
    const {activePage, pageSize, confirmedSearchString} = this.state
    this.setState({isLoading: true})
    if (confirmedSearchString.length !== 0) {
      seriesSearch({text: confirmedSearchString, limit: pageSize, skip: (activePage - 1) * pageSize}).then(data => {
        this.setState({isLoading: false, isSearching: false})
        if(!data) {
          toast.error('Cannot search series!')
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
    getSeries(activePage, pageSize, {state: 'archived'}).then(result => {
      this.setState({isLoading: false, isSearching: false})
      if(!result) return
      if(result.errors && result.errors.length) {
        toast.error('Cannot get series list!')
        return
      }
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
    const {searchString, confirmedSearchString} = this.state
    if (confirmedSearchString !== searchString) {
      this.setState({isSearching: true, isLoading: true})
      setTimeout(() => {
        this.setState({confirmedSearchString: searchString}, this._handleGetSeries)
      }, 500)
    }
  }

  _changePageSize = (e, data) => {
    this.setState({pageSize: data.value}, this._handleGetSeries)
  }

  _handlePaginationChange = (e, {activePage}) => {
    this.setState({
      activePage
    }, this._handleGetSeries )
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

  _showConfirm = (archivedItem, e) => {
    e.stopPropagation()
    this.setState({archivedItem, showConfirm: true})
  }

  _handleRestore = () => {
    const {archivedItem, isArchivingIds} = this.state
    isArchivingIds.push(archivedItem._id)
    this.setState({showConfirm: false, isArchivingIds})
    updateSeriesMany(
      {state: 'published'},
      {_ids: isArchivingIds}
    ).then(result => {
      if (result && !result.errors) {
        toast.success(`Series [${archivedItem.title}] restored successfully.`)
        this.setState({selected: [], isArchivingIds: [], archivedItem: {}})
        this._handleGetSeries()
      } else {
        toast.error(`Series [${archivedItem.title}] restored failed.`)
      }
    })
  }

  _handleBulkRestore = () => {
    const {selected} = this.state
    this.setState({isArchivingIds: selected, showBulkConfirm: false})
    updateSeriesMany(
      {state: 'published'},
      {_ids: selected}
    ).then(result => {
      if (result && !result.errors) {
        toast.success(`[${selected.length}] selected series restored successfully.`)
        this.setState({selected: [], isArchivingIds: [], archivedItem: {}})
        this._handleGetSeries()
      } else {
        toast.error(`Restored series failed.`)
      }
    })
  }

  render() {
    ChangeTitle('Series List')
    const {history} = this.props
    const {searchField, isSearching, searchString, activePage, items, total, pageSize, selected, isLoading, isArchivingIds, showConfirm, showBulkConfirm} = this.state

    return (
      <div>
        <Segment.Group>
          <Segment color='blue'>
            <h2>Series List</h2>
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
                  content='Restore selected series'
                  negative
                  disabled={selected.length === 0}
                  onClick={() => this.setState({showBulkConfirm: true})} />}
              </div>
            </div>
          </Segment>
          {items.length === 0 && <Segment>
            {isLoading ? <div><Loader active inline size='mini' /> &nbsp; Loading data</div>
              : <i style={{color: '#999'}}>
                Sorry. There's nothing to show.
              </i>}
          </Segment>}
        </Segment.Group>
        {!!items.length && <div style={{position: 'relative'}}>
          {isLoading && <Dimmer active inverted><Loader /></Dimmer>}
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{width: 40}}>
                  <Checkbox
                    checked={selected.length === items.length}
                    indeterminate={selected.length < items.length && selected.length > 0}
                    onClick={() => this._handleSelectAll(items)}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell style={{width: 40}}>#</Table.HeaderCell>
                <Table.HeaderCell style={{width: 90}}/>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell style={{width: 100}}>Action</Table.HeaderCell>
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
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>
                      <div style={{width: 70, height: 45, backgroundColor: 'rgba(0,0,0,0.15)'}}>
                        {!!item.originalImages.length && <img
                          src={item.originalImages && item.originalImages[item.originalImages.length - 1].url}
                          alt={(item.originalImages && item.originalImages[item.originalImages.length - 1].name) || ''}
                          style={{width: 70, height: 45, verticalAlign: 'top', objectFit: 'cover'}}
                        />}
                      </div>
                    </Table.Cell>
                    <Table.Cell><Link to={'/series/edit/' + item._id}>{item.title}</Link></Table.Cell>
                    <Table.Cell>{item.shortDescription}</Table.Cell>
                    <Table.Cell>{item.type}</Table.Cell>
                    <Table.Cell>
                      {isArchivingIds.indexOf(item._id) !== -1
                      ? <div style={{height: 21}}>
                        <Loader active size='mini' inline />
                        <span style={{fontSize: '10px'}}> &nbsp; Restoring...</span>
                      </div>
                      : 
                      <div>
                        <Popup
                          trigger={<Button icon='edit' size='mini' as={Link} to={`/series/edit/${item._id}`} />}
                          content='Edit this series.'
                          inverted
                        />
                        <Popup
                          trigger={<Button icon='trash' size='mini' onClick={(e) => this._showConfirm(item, e)} />}
                          content='Restore this series.'
                          inverted
                        />
                      </div>}
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
          <Pagination
            currentPage={activePage}
            pageSize={pageSize}
            total={total}
            history={history}
            onchangeSize={this._changePageSize}
            url='/series/list' />
          <Confirm
            open={showConfirm}
            content={`Are you sure to restore series [${this.state.archivedItem.title || ''}] ?`}
            cancelButton='No'
            confirmButton='Yes'
            onCancel={() => this.setState({showConfirm: false})}
            onConfirm={this._handleRestore}
          />
          <Confirm
            open={showBulkConfirm}
            content={`Are you sure to restore all these ${selected.length} selected series?`}
            cancelButton='No'
            confirmButton='Yes'
            onCancel={() => this.setState({showBulkConfirm: false})}
            onConfirm={this._handleBulkRestore}
          />
        </div>}
      </div>
    )
  }
}
