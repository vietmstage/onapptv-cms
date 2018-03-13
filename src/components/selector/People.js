import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form, Modal, Button} from 'semantic-ui-react'
import DropDown from '../common/Dropdown'
import {getPeople, createPeople} from '../../actions/common'
import { toast } from 'react-toastify';
export default class People extends Component {
  static propTypes = {
    onDataCallback: PropTypes.func,
    data: PropTypes.object
  }

  state = {
    directorOptions: [],
    castOptions: [],
    producerOptions: [],
    directorIds: [],
    castIds: [],
    producerIds: [],
    modalOpen: false,
    name: '',
    role: [],
    roleOptions: [
      {text: 'Director', value: 'Director'},
      {text: 'Castor', value: 'Castor'},
      {text: 'Producer', value: 'Producer'}
    ],
    target: ''
  }

  componentDidMount () {
    this.setState({...this.props.data})
    this._handleGetRole()
  }

  componentWillReceiveProps (nextProps) {
    if(JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
      this.setState({
        ...nextProps.data
      })
    }
  }

  _handleGetRole = () => {
    getPeople('Director').then(res => {
      if(res) {
        const directorOptions = res.items
        this.setState({directorOptions})
      }
    })
    getPeople('Castor').then(res => {
      if(res) {
        const castOptions = res.items
        this.setState({castOptions})
      }
    })
    getPeople('Producer').then(res => {
      if(res) {
        const producerOptions = res.items
        this.setState({producerOptions})
      }
    })
  }

  _handleAddNewItem = (e, {name, value}) => {
    this.setState({
      target: name,
      name: value,
      modalOpen: true
    })
  }

  _handleInputChange = (e, {name, value}) => {
    this.setState({
      [name]: value
    }, this._callback)
  }

  _handleModalClose = () => {
    this.setState({
      modalOpen: false
    })
  }

  _handlePeopleCreate = () => {
    const {name, role} = this.state
    createPeople({name, role}).then(data => {
      if(!data) {
        toast.error('Cannot create new role!!!')
        return
      }

      toast.success('Create new role successfully!!!')

      let temp = this.state[this.state.target]
      const index = temp.indexOf(this.state.name)

      this._handleGetRole()

      if(index > -1) {
        temp.splice(index, 1)
      }
      this.setState({
        [this.state.target]: [
          ...temp,
          data.recordId
        ],
        name: '',
        role: [],
        modalOpen: false
      }, this._callback)
    })
  }

  _handleRoleChange = (e, {value}) => this.setState({role: value})

  _callback = () => {
    const {directorIds, castIds, producerIds} = this.state
    const {onDataCallback} = this.props
    onDataCallback && onDataCallback({
      directorIds,
      castIds,
      producerIds
    })
  }

  render() {
    const {
      directorOptions = [],
      castOptions = [],
      producerOptions = [],
      directorIds = [],
      castIds = [],
      producerIds = [],
      modalOpen,
      name,
      role,
      roleOptions
    } = this.state
    return (
      <React.Fragment>
        <Form.Field>
          <label>Director:</label>
          <DropDown
            name='directorIds'
            options={directorOptions}
            placeholder='Choose director'
            search selection fluid multiple allowAdditions
            value={directorIds}
            onAddItem={this._handleAddNewItem}
            onChange={this._handleInputChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Cast:</label>
          <DropDown
            name='castIds'
            options={castOptions}
            placeholder='Choose cast'
            search selection fluid multiple allowAdditions
            value={castIds}
            onAddItem={this._handleAddNewItem}
            onChange={this._handleInputChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Producer:</label>
          <DropDown
            name='producerIds'
            options={producerOptions}
            placeholder='Choose producer'
            search selection fluid multiple allowAdditions
            value={producerIds}
            onAddItem={this._handleAddNewItem}
            onChange={this._handleInputChange}
          />
        </Form.Field>
        <Modal open={modalOpen}>
          <Modal.Header>
            Create new role
          </Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                label='Name:'
                placeholder='Name'
                name='name'
                value={name}
                onChange={(e, {name, value}) => this.setState({[name]: value})}
              />
              <Form.Field>
                <label>Role:</label>
                <DropDown
                  options={roleOptions}
                  search selection fluid multiple
                  value={role}
                  onChange={this._handleRoleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this._handleModalClose}>Cancel</Button>
            <Button primary onClick={this._handlePeopleCreate}>Create</Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    )
  }
}
