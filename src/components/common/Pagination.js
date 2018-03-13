import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import range from 'lodash/range'
import DropDown from './Dropdown'

class Pagination extends Component {
  _jumpToPage = (e, {value}) => {
    const {history, url} = this.props
    history.push(`${url}/${value}`)
  }

  render () {
    const {currentPage, total, url, pageSize, onchangeSize} = this.props
    if (total <= pageSize) return null
    const totalPages = Math.ceil(total / pageSize)
    const endPage = Math.min(totalPages, currentPage + Math.max(3, 7 - currentPage))
    const startPage = Math.max(1, currentPage - Math.max(3, 6 - totalPages + currentPage))
    return (
      <div className='clearfix ms-pagination'>
        <div className='left' style={{lineHeight: '30px'}}>
          <strong>Items per page: </strong>
          <DropDown
            selection
            compact
            value={pageSize}
            style={{width: 80, marginLeft: 10}}
            upward
            onChange={onchangeSize}
            options={[
              {key: 1, value: 10, text: '10'},
              {key: 2, value: 20, text: '20'},
              {key: 3, value: 50, text: '50'},
              {key: 4, value: 100, text: '100'}
            ]} />
        </div>
        {totalPages < 2 ? null : [
          <Menu floated='right' pagination size='tiny' key={1}>
            <Menu.Item as={Link} icon
              to={url}
              disabled={currentPage === 1}
            >
              <Icon name='angle double left' />
            </Menu.Item>
            <Menu.Item as={Link} icon
              to={currentPage <= 2 ? url : `${url}/${currentPage - 1}`}
              disabled={currentPage === 1}
            >
              <Icon name='angle left' />
            </Menu.Item>
            {range(startPage, endPage + 1).map((page, index) => (
              <Menu.Item
                as={Link}
                className={page === currentPage ? 'active' : null}
                key={index}
                to={page === 1 ? url : `${url}/${page}`}>
                {page}
              </Menu.Item>
            ))}

            <Menu.Item as={Link} icon
              to={currentPage === totalPages ? `${url}/${totalPages}` : `${url}/${currentPage + 1}`}
              disabled={currentPage === totalPages}
            >
              <Icon name='angle right' />
            </Menu.Item>

            <Menu.Item as={Link} icon
              to={`${url}/${totalPages}`}
              disabled={currentPage === totalPages}
            >
              <Icon name='angle double right' />
            </Menu.Item>
          </Menu>,
          <div className='right' style={{lineHeight: '30px'}} key={2}>
            <strong>Jump to: </strong>
            <DropDown
              selection
              search
              compact
              value={currentPage}
              style={{width: 80, marginLeft: 10}}
              upward
              onChange={this._jumpToPage}
              options={range(0, totalPages).map(page => { return {key: page, value: page + 1, text: 'Page ' + (page + 1)} })} />
          </div>
        ]
        }
      </div>
    )
  }
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  history: PropTypes.object,
  onchangeSize: PropTypes.func,
  pageSize: PropTypes.number,
  total: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired
}

Pagination.defaultProps = {
  pageSize: 10
}

export default Pagination
