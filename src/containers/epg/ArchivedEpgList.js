import React, { Component } from 'react'
import ChangeTitle from '../../libs/ChangeTitle'
import { Table, Segment, Input, Button, Popup, Checkbox, Loader, Dimmer, Confirm } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
// import {connect} from 'react-redux'
import { getEpgList, epgSearch, epgUpdate } from '../../actions/epg'
import Pagination from '../../components/common/Pagination'
import {toast} from 'react-toastify'
export default class ArchivedEpgList extends Component {
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
      epgSearch({text: confirmedSearchString, limit: pageSize, skip: (activePage - 1) * pageSize}).then(data => {
        this.setState({isLoading: false, isSearching: false})
        if(!data) {
          toast.error('Cannot search channel!')
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
    getEpgList({pageg: activePage, perPage: pageSize, filter: {state: 'archived'}}).then(result => {
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

  _handleRestore = () => {
    const {archivedItem, selected, isArchivingIds} = this.state
    isArchivingIds.push(archivedItem._id)
    this.setState({showConfirm: false, isArchivingIds})
    // setTimeout(() => {
    //   const archivedCompanies = JSON.parse(window.localStorage.getItem('archivedCompanies')) || []
    //   archivedCompanies.push(archivedItem._id)
    //   window.localStorage.setItem('archivedCompanies', JSON.stringify(archivedCompanies))
    //   selected.splice(selected.indexOf(archivedItem._id), 1)
    //   isLoading.splice(isLoading.indexOf(archivedItem._id), 1)
    //   this.setState({selected, isLoading})
    //   toast.success(`Company [${archivedItem.name}] archived successfully.`)
    // }, 1000)
    epgUpdate({
      record: {state: 'published'},
      filter: {_ids: isArchivingIds}
    }).then(result => {
      if (result && !result.errors) {
        this.setState({selected: [], isArchivingIds: [], archivedItem: {}})
        toast.success(`Epg [${archivedItem.videoData.title}] restored successfully.`)
        this._handleGetEpgList()
      } else {
        toast.error(`Epg [${archivedItem.videoData.title}] restored failed.`)
      }
    })
  }

  _handleBulkRestore = () => {
    const {selected, companies} = this.state
    // const tmp = cloneDeep(companies)
    this.setState({isArchivingIds: selected, showBulkConfirm: false})
    // setTimeout(() => {
    //   const archivedCompanies = JSON.parse(window.localStorage.getItem('archivedCompanies')) || []
    //   tmp.map((company, index) => {
    //     if (selected.indexOf(company._id) !== -1) archivedCompanies.push(company._id)
    //     return null
    //   })
    //   window.localStorage.setItem('archivedCompanies', JSON.stringify(archivedCompanies))
    //   this.setState({isLoading: [], selected: []})
    //   toast.success(`${selected.length} selected companies archived successfully.`)
    // }, 2000)
    epgUpdate({
      record: {state: 'published'},
      filter: {_ids: selected}
    }).then(result => {
      console.log(result)
      if (result && !result.errors) {
        this.setState({selected: [], isArchivingIds: [], archivedItem: {}})
        toast.success(`[${selected.length}] selected epgs restored successfully.`)
        this._handleGetEpgList()
      } else {
        toast.error(`Restored epgs failed.`)
      }
    })
  }

  render() {
    ChangeTitle('Epg Archived List')
    const {history} = this.props
    const {searchField, isSearching, searchString, activePage, items, total, pageSize, selected, isLoading, isArchivingIds, showBulkConfirm, showConfirm} = this.state

    return (
      <div>
        <Segment.Group>
          <Segment color='blue'>
            <h2>Epg Archived List</h2>
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
                {/* <Input
                  icon='search'
                  loading={isSearching}
                  style={{width: 250}}
                  value={searchString}
                  onKeyDown={this._handleEnter}
                  onBlur={this._handleSearch}
                  onChange={(e, {value}) => this.setState({searchString: value})}
                  placeholder='Enter search string...' /> */}
              </div>
              <div>
                {items.length > 0 && <Button
                  size='tiny'
                  content='Restore epgs'
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
                        <span style={{fontSize: '10px'}}> &nbsp; Restoring...</span>
                      </div>
                      : <div>
                        <Popup
                          trigger={<Button icon='edit' size='mini' as={Link} to={`/epg/edit/${item._id}`} />}
                          content='Edit this epg.'
                          inverted
                        />
                        <Popup
                          trigger={<Button icon='recycle' size='mini' onClick={(e) => this._showConfirm(item, e)} />}
                          content='Restore this epg.'
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
            content={`Are you sure to restore epg [${(this.state.archivedItem.videoData && this.state.archivedItem.videoData.title) || ''}] ?`}
            cancelButton='No'
            confirmButton='Yes'
            onCancel={() => this.setState({showConfirm: false})}
            onConfirm={this._handleRestore}
          />
          <Confirm
            open={showBulkConfirm}
            content={`Are you sure to restore all these ${selected.length} selected epgs?`}
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
