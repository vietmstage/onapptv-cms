import React, { Component } from 'react'
import ChangeTitle from '../../libs/ChangeTitle'
import { Table, Segment, Input, Button, Popup, Checkbox, Loader, Confirm, Dimmer } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
// import {connect} from 'react-redux'
import { getChannel, channelSearch, updateChannelMany } from '../../actions/channel';
import Pagination from '../../components/common/Pagination'
import {connect} from 'react-redux'
import { toast } from 'react-toastify';
@connect(state => {
  return {
    router: state.routing
  }
})
export default class ArchivedChannelList extends Component {
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
    isLoading: false,
    showConfirm: false,
    showBulkConfirm: false,
    isArchivingIds: [],
    archivedItem: {}
  }

  componentDidMount () {
    if (this.props.match.params.page) {
      this.setState({activePage: parseInt(this.props.match.params.page, 10) || 1}, this._handleGetChannel)
    } else {
      this._handleGetChannel()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.page !== nextProps.match.params.page) {
      this.setState({activePage: parseInt(nextProps.match.params.page, 10) || 1}, this._handleGetChannel)
    }
  }
  

  _handleGetChannel = () => {
    const {activePage, pageSize, confirmedSearchString} = this.state
    this.setState({isLoading: true})
    if(confirmedSearchString.length !== 0) {
      channelSearch(confirmedSearchString, pageSize, (activePage - 1) * pageSize).then(data => {
        if(!data) {
          toast.error('Cannot search channel!')
          return
        }
        const {items, count} = data
        this.setState({
          items,
          total: count,
          selected: [],
          isLoading: false
        })
      })
      return
    }
    getChannel(activePage, pageSize, {state: 'archived'}).then(result => {
      if(!result || result.errors) return
      const {items, count} = result.data.viewer.data
      this.setState({
        items,
        total: count,
        selected: [],
        isLoading: false
      })
    })
  }

  _handleEnter = (e) => {
    if (e.keyCode === 13) this._handleSearch()
  }

  _handleSearch = () => {
    const {searchString, confirmedSearchString} = this.state
    if (confirmedSearchString !== searchString) {
      this.setState({isSearching: true})
      setTimeout(() => {
        this.setState({confirmedSearchString: searchString, isSearching: false}, this._handleGetChannel)
      }, 500)
    }
  }

  _changePageSize = (e, data) => {
    this.setState({pageSize: data.value}, this._handleGetChannel)
  }

  _handlePaginationChange = (e, {activePage}) => {
    this.setState({
      activePage
    }, this._handleGetChannel )
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
    updateChannelMany(
      {state: 'published'},
      {_ids: isArchivingIds}
    ).then(result => {
      if (result && !result.errors) {
        this.setState({selected: [], isArchivingIds: [], archivedItem: {}})
        toast.success(`Channel [${archivedItem.title}] restored successfully.`)
        this._handleGetChannel()
      } else {
        toast.error(`Channel [${archivedItem.title}] restored failed.`)
      }
    })
  }

  _handleBulkRestore = () => {
    const {selected} = this.state
    this.setState({isArchivingIds: selected, showBulkConfirm: false})
    updateChannelMany(
      {state: 'published'},
      {_ids: selected}
    ).then(result => {
      console.log(result)
      if (result && !result.errors) {
        this.setState({selected: [], isArchivingIds: [], archivedItem: {}})
        toast.success(`[${selected.length}] selected channels restored successfully.`)
        this._handleGetChannel()
      } else {
        toast.error(`Restored channels failed.`)
      }
    })
  }

  render() {
    ChangeTitle('Channel List')
    const {history} = this.props
    const {searchField, isSearching, searchString, activePage, items, total, pageSize, selected, isLoading, showConfirm, showBulkConfirm, isArchivingIds} = this.state

    return (
      <div>
        <Segment.Group>
          <Segment color='blue'>
            <h2>Channel List</h2>
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
                  content='Restore selected channels'
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
                <Table.HeaderCell style={{width: 90}}/>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Etc...</Table.HeaderCell>
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
                    <Table.Cell>
                      <div>
                        {!!item.originalImages.length && <img
                          src={item.originalImages && item.originalImages[item.originalImages.length - 1].url}
                          alt={(item.originalImages && item.originalImages[item.originalImages.length - 1].name) || ''}
                          style={{width: 70, height: 45, verticalAlign: 'top', objectFit: 'cover'}}
                        />}
                      </div>
                    </Table.Cell>
                    <Table.Cell><Link to={'/channel/edit/' + item._id}>{item.title}</Link></Table.Cell>
                    <Table.Cell>{item.shortDescription}</Table.Cell>
                    <Table.Cell>{item.type}</Table.Cell>
                    <Table.Cell>Etc...</Table.Cell>                  
                    <Table.Cell>
                      {isArchivingIds.indexOf(item._id) !== -1
                      ? <div style={{height: 21}}>
                        <Loader active size='mini' inline />
                        <span style={{fontSize: '10px'}}> &nbsp; Restoring...</span>
                      </div>
                      : <div>
                      <Popup
                        trigger={<Button icon='edit' size='mini' as={Link} to={`/channel/edit/${item._id}`} />}
                        content='Edit this channel.'
                        inverted
                      />
                      <Popup
                        trigger={<Button icon='recycle' size='mini' onClick={(e) => this._showConfirm(item, e)} />}
                        content='Restore this channel.'
                        inverted
                      />
                    </div>}
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        </div>}
        <Pagination
          currentPage={activePage}
          pageSize={pageSize}
          total={total}
          history={history}
          onchangeSize={this._changePageSize}
          url='/channel/list' />
        <Confirm
            open={showConfirm}
            content={`Are you sure to archive video [${this.state.archivedItem.title || ''}] ?`}
            cancelButton='No'
            confirmButton='Yes'
            onCancel={() => this.setState({showConfirm: false})}
            onConfirm={this._handleRestore}
          />
        <Confirm
            open={showBulkConfirm}
            content={`Are you sure to archive all these ${selected.length} selected channels?`}
            cancelButton='No'
            confirmButton='Yes'
            onCancel={() => this.setState({showBulkConfirm: false})}
            onConfirm={this._handleBulkRestore}
          />
      </div>
    )
  }
}
