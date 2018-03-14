import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {newsSearch, getNews} from '../../actions/news'
import {toast} from 'react-toastify'
import debounce from 'lodash/debounce'
import ChangeTitle from '../../libs/ChangeTitle';
import {Segment, Table, Input, Button, Popup} from 'semantic-ui-react'
import Pagination from '../../components/common/Pagination'
import { Link } from 'react-router-dom'

export default class NewsList extends Component {
  static propTypes = {

  }

  state = {
    isSearching: false,
    confirmedSearchString: '',
    searchString: '',
    activePage: 1,
    pageSize: 20,
    items: [],
    total: 0
  }

  componentDidMount () {
    if (this.props.match.params.page) {
      this.setState({activePage: parseInt(this.props.match.params.page, 10) || 1}, this._handleGetNews)
    } else {
      this._handleGetNews()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.page !== nextProps.match.params.page) {
      this.setState({activePage: parseInt(nextProps.match.params.page, 10) || 1}, this._handleGetNews)
    }
  }
  
  _handleGetNews = () => {
    const {activePage, pageSize, confirmedSearchString} = this.state
    if (confirmedSearchString.length !== 0) {
      newsSearch(confirmedSearchString, pageSize, (activePage - 1) * pageSize).then(data => {
        this.setState({
          isSearching: false
        })
        console.log(data)
        if(!data) {
          toast.error('Cannot search channel!')
          return
        }
        const {items, count} = data
        this.setState({
          items,
          total: count
        })
      })
      return
    }
    getNews(activePage, pageSize).then(result => {
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
    const {searchString} = this.state
      this.setState({confirmedSearchString: searchString, activePage: 1, isSearching: true}, this._handleGetNews)
  }

  _changePageSize = (e, data) => {
    this.setState({pageSize: data.value}, this._handleGetNews)
  }

  render() {
    ChangeTitle('News List')
    const {history} = this.props
    const {searchField, isSearching, searchString, activePage, items, total, pageSize} = this.state
    return (
      <div>
        <Segment color='blue'>
          <h2>Video List</h2>
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
                onChange={(e, {value}) => this.setState({searchString: value})}
                placeholder='Enter search string...' />
            </div>
            <div>
              <Button
                size='tiny'
                primary
                content='Add video'
                as={Link}
                to='/video/add' />
            </div>
          </div>
        </Segment>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{width: 90}}></Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Url</Table.HeaderCell>
              <Table.HeaderCell style={{width: 76}}>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((item, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>
                    <div>
                      {item.originalImage && <img
                        src={item.originalImage && item.originalImage.url}
                        alt={(item.originalImage && item.originalImage.name) || ''}
                        style={{width: 70, height: 45, verticalAlign: 'top', objectFit: 'cover'}}
                      />}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{item.title}</Table.Cell>
                  <Table.Cell>{item.shortDescription}</Table.Cell>
                  <Table.Cell>{item.url}</Table.Cell>
                  <Table.Cell>
                    <div>
                      <Popup
                        trigger={<Button icon='edit' size='mini' as={Link} to={`/video/edit/${item._id}`} />}
                        content='Edit this video.'
                        inverted
                      />
                      <Popup
                        trigger={<Button icon='trash' size='mini' onClick={(e) => this._showConfirm({}, e)} />}
                        content='Archive this video.'
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
            url='/video/list' />
        </div>
      </div>
    )
  }
}