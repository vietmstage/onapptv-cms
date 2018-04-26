import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Table, Segment, Input, Button, Popup, Checkbox, Loader, Dimmer, Confirm } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import ChangeTitle from '../../libs/ChangeTitle';
import { getEpgList } from '../../actions/epg';
import Pagination from '../../components/common/Pagination'

export default class EpgList extends Component {
  // static propTypes = {

  // }

  state = {
    searchField: 'title',
    isSearching: false,
    confirmedSearchString: '',
    searchString: '',
    activePage: 1,
    pageSize: 10,
    items: [],
    total: 0,
    selected: [],
    isArchivingIds: [],
    showConfirm: false,
    showBulkConfirm: false,
    archivedItem: {}
  }

  componentDidMount () {
    if (this.props.match.params.page) {
      this.setState({activePage: parseInt(this.props.match.params.page, 10) || 1}, this._handleGetEpgList)
    } else {
      this._handleGetEpgList()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.page !== nextProps.match.params.page) {
      this.setState({activePage: parseInt(nextProps.match.params.page, 10) || 1}, this._handleGetEpgList)
    }
  }

  _handleGetEpgList = () => {
    const {activePage, pageSize, confirmedSearchString} = this.state
    this.setState({isLoading: true})
    if (confirmedSearchString.length !== 0) {
      // videoSearch(confirmedSearchString, pageSize, (activePage - 1) * pageSize).then(data => {
      //   this.setState({isLoading: false, isSearching: false})
      //   if(!data) {
      //     toast.error('Cannot search channel!')
      //     return
      //   }
      //   const {items, count} = data
      //   this.setState({
      //     items,
      //     total: count,
      //     selected: []
      //   })
      // })
      // return
    }
    getEpgList({page: activePage, perPage: pageSize}).then(result => {
      this.setState({isLoading: false, isSearching: false})
      if (result && !result.errors) {
        const {items, count} = result.data
        this.setState({
          items,
          total: count,
          selected: []
        })
      }
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
        this.setState({confirmedSearchString: searchString, activePage: 1}, this._handleGetEpgList)
      }, 500)
    }
  }

  _changePageSize = (e, data) => {
    this.setState({pageSize: data.value}, this._handleGetEpgList)
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

  _handleArchive = () => {
    // const {archivedItem, isArchivingIds} = this.state
    // isArchivingIds.push(archivedItem._id)
    // this.setState({showConfirm: false, isArchivingIds})
    // updateVideoMany(
    //   {state: 'archived'},
    //   {_ids: isArchivingIds}
    // ).then(result => {
    //   if (result && !result.errors) {
    //     this.setState({selected: [], isArchivingIds: [], archivedItem: {}})
    //     toast.success(`Video [${archivedItem.title}] archived successfully.`)
    //     this._handleGetEpgList()
    //   } else {
    //     toast.error(`Video [${archivedItem.title}] archived failed.`)
    //   }
    // })
  }

  _handleBulkArchive = () => {
    // const {selected} = this.state
    // this.setState({isArchivingIds: selected, showBulkConfirm: false})
    // updateVideoMany(
    //   {state: 'archived'},
    //   {_ids: selected}
    // ).then(result => {
    //   if (result && !result.errors) {
    //     toast.success(`[${selected.length}] selected videos archived successfully.`)
    //     this.setState({selected: [], isArchivingIds: [], archivedItem: {}})
    //     this._handleGetEpgList()
    //   } else {
    //     toast.error(`Archived videos failed.`)
    //   }
    // })
  }

  render() {
    ChangeTitle('Epg List')
    const {history} = this.props
    const {searchField, isSearching, searchString, activePage, items, total, pageSize, selected, isLoading, isArchivingIds, showBulkConfirm, showConfirm} = this.state

    return (
      <div>
        <Segment.Group>
          <Segment color='blue'>
            <h2>Epg List</h2>
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
                  content='Archive selected epgs'
                  negative
                  disabled={selected.length === 0}
                  onClick={() => this.setState({showBulkConfirm: true})} />}
                {/* <Button
                  size='tiny'
                  primary
                  content='Add epg'
                  as={Link}
                  to='/meta/add' /> */}
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
                <Table.HeaderCell style={{width: 40}}>
                  <Checkbox
                    checked={selected.length === items.length}
                    indeterminate={selected.length < items.length && selected.length > 0}
                    onClick={() => this._handleSelectAll(items)}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell style={{width: 40}}>#</Table.HeaderCell>
                <Table.HeaderCell>Video title</Table.HeaderCell>
                <Table.HeaderCell>Channel title</Table.HeaderCell>
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
                    <Table.Cell>{item.videoData.title}</Table.Cell>
                    <Table.Cell>{item.channelData.title}</Table.Cell>
                    <Table.Cell>
                      {isArchivingIds.indexOf(item._id) !== -1
                      ? <div style={{height: 21}}>
                        <Loader active size='mini' inline />
                        <span style={{fontSize: '10px'}}> &nbsp; Archiving...</span>
                      </div>
                      : <div>
                        {/* <Popup
                          trigger={<Button icon='edit' size='mini' as={Link} to={`/meta/edit/${item._id}`} />}
                          content='Edit this .'
                          inverted
                        /> */}
                        <Popup
                          trigger={<Button icon='trash' size='mini' onClick={(e) => this._showConfirm(item, e)} />}
                          content='Archive this epg.'
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
            url='/epg/list' />
          <Confirm
            open={showConfirm}
            content={`Are you sure to archive epg [${this.state.archivedItem.title || ''}] ?`}
            cancelButton='No'
            confirmButton='Yes'
            onCancel={() => this.setState({showConfirm: false})}
            onConfirm={this._handleArchive}
          />
          <Confirm
            open={showBulkConfirm}
            content={`Are you sure to archive all these ${selected.length} selected epgs?`}
            cancelButton='No'
            confirmButton='Yes'
            onCancel={() => this.setState({showBulkConfirm: false})}
            onConfirm={this._handleBulkArchive}
          />
        </div>}
      </div>
    )
  }
}
