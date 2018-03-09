import React, { Component } from 'react'
import ChangeTitle from '../../libs/ChangeTitle'
import { Table, Segment, Input, Button, Popup } from 'semantic-ui-react'
import DropDown from '../../components/common/Dropdown'
import { Link } from 'react-router-dom'
// import {connect} from 'react-redux'
import { getChannel } from '../../actions/channel';
import Pagination from '../../components/common/Pagination'
import {connect} from 'react-redux'
@connect(state => {
  return {
    router: state.routing
  }
})
export default class ChannelList extends Component {
  state = {
    searchField: 'title',
    isSearching: false,
    searchString: '',
    activePage: 1,
    pageSize: 20,
    items: [],
    total: 0
  }

  componentDidMount () {
    if (this.props.match.params.page) {
      this.setState({activePage: parseInt(this.props.match.params.page, 10)}, this._handleGetChannel)
    } else {
      this._handleGetChannel()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.page !== nextProps.match.params.page) {
      this.setState({activePage: parseInt(nextProps.match.params.page, 10)}, this._handleGetChannel)
    }
  }
  

  _handleGetChannel = () => {
    const {activePage, pageSize} = this.state
    getChannel(activePage, pageSize).then(result => {
      if(!result) return
      const {items, count} = result.data.viewer.data
      this.setState({
        items,
        total: count
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
        this.setState({confirmedSearchString: searchString, isSearching: false, selected: []})
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
  render() {
    ChangeTitle('Channel List')
    const {history} = this.props
    const {searchField, isSearching, searchString, activePage, items, total, pageSize} = this.state

    return (
      <div>
        <Segment color='blue'>
          <h2>Channel List</h2>
          <div className="flex-box">
            <div>
              <DropDown
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
              />
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
              <Button
                size='tiny'
                primary
                content='Add Channel'
                as={Link}
                to='/channel/add' />
            </div>
          </div>
        </Segment>
        <Table>
          <Table.Header>
            <Table.Row> 
              {/* <Table.HeaderCell></Table.HeaderCell> */}
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Etc...</Table.HeaderCell>
              <Table.HeaderCell style={{width: 76}}>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((item, index) => {
              return (
                <Table.Row key={index}>
                  {/* <Table.Cell>
                    <div>
                      {item.thumbnails && <img src={item.thumbnails[0].url || ''} alt={item.thumbnails[0].name || ''} style={{width: 54, height: 36}} />}
                    </div>
                  </Table.Cell> */}
                  <Table.Cell>{item.title}</Table.Cell>
                  <Table.Cell>{item.shortDescription}</Table.Cell>
                  <Table.Cell>{item.type}</Table.Cell>
                  <Table.Cell>Etc...</Table.Cell>                  
                  <Table.Cell>
                    <div>
                      <Popup
                        trigger={<Button icon='edit' size='mini' as={Link} to={`/channel/edit/}`} />}
                        content='Edit this channel.'
                        inverted
                      />
                      <Popup
                        trigger={<Button icon='trash' size='mini' onClick={(e) => this._showConfirm({}, e)} />}
                        content='Archive this channel.'
                        inverted
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
        {/* <div style={{textAlign: 'right'}}>
          <Pagination
            activePage={activePage}
            onPageChange={this._handlePaginationChange}
            totalPages={Math.ceil(total/pageSize)}
          />
        </div> */}
        <Pagination
          currentPage={activePage}
          pageSize={pageSize}
          total={total}
          history={history}
          onchangeSize={this._changePageSize}
          url='/channel/list' />
      </div>
    )
  }
}
