import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Segment, Form, Button, Label, Dimmer, Loader, Icon, Table, Checkbox } from 'semantic-ui-react'
import { getConfig, configCreate, configRemove } from '../../actions/common';
import {toast} from 'react-toastify'
export default class ConfigVideoMeta extends Component {
  static propTypes = {
    type: PropTypes.string
  }
  state = {
    configData: [],
    configKey: '',
    selected: []
  }
  componentDidMount () {
    const {type} = this.props
    this.setState({loading: true})
    getConfig({
      filter: {
        type
      }
    }).then(result => {
      this.setState({
        loading: false
      })
      if (result && !result.errors) {
        this.setState({
          configData: result.data
        })
      }
    })
  }

  _handleInputChange = (e, {name, value}) => this.setState({[name]: value})

  _handleAdd = () => {
    const {type} = this.props
    const {configKey, configData} = this.state
    this.setState({
      loading: true
    })
    configCreate({
      record: {
        type,
        name: configKey
      }
    }).then(result => {
      this.setState({
        loading: false
      })
      if (result && !result.errors) {
        toast.success('Create config data successfully.')
        result.data && configData.push(result.data.record)
        this.setState({
          configKey: '',
          configData
        })
      } else {
        toast.error('Create config data failed.')
      }
    })
  }

  _handleRemove = (index) => {
    const {configData} = this.state
    this.setState({loading: true})
    configRemove(configData[index]._id).then(result => {
      this.setState({loading: false})
      if (result && !result.errors) {
        toast.success('Remove config data successfully')
        configData.splice(index, 1)
        this.setState({configData})
      } else {
        toast.error('Remove config data failed.')
      }
    })
  }

  render() {
    const {configKey, configData, loading, selected} = this.state
    return (
      <div style={{position: 'relative', width: 400}}>
        {loading && <Dimmer active inverted><Loader /></Dimmer>}
        <Segment>
          <div>
            <h3>Add new config key</h3>
            <Form style={{width: 200}}>
              <Form.Group widths='equal' style={{alignItems: 'flex-end'}}>
                <Form.Input
                  label='New meta key'
                  placeholder='New meta key'
                  value={configKey}
                  name='configKey'
                  onChange={this._handleInputChange}
                />
                <Form.Field style={{width: 42}}>
                  <Button
                    icon='add'
                    style={{
                      width: 29,
                      height: 29,
                      margin: 0,
                      padding: 0
                    }}
                    onClick={this._handleAdd}
                  />
                </Form.Field>
              </Form.Group>
            </Form>
          </div>
          {/* {!!configData.length && <div className='config__list'>
            {configData.map((config, index) => <div className='config__item' key={config._id}>
              <Label content={config.name} />
              <Icon name='remove circle' onClick={() => this._handleRemove(index)} className='config__icon' />
            </div>)}
          </div>} */}
        </Segment>
        {!!configData.length && <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{width: 40}}>
                <Checkbox
                  checked={selected.length === configData.length}
                  indeterminate={selected.length < configData.length && selected.length > 0}
                  onClick={() => this._handleSelectAll(configData)}
                />
              </Table.HeaderCell>
              <Table.HeaderCell style={{width: 40}}>#</Table.HeaderCell>
              <Table.HeaderCell>Config value</Table.HeaderCell>
              <Table.HeaderCell style={{width: 90}}>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {configData.map((config, index) => <Table.Row key={config._id}>
              <Table.Cell><Checkbox checked={selected.indexOf(config._id) !== -1} /></Table.Cell>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell><Label content={config.name} color='blue' /></Table.Cell>
              <Table.Cell>
                <Button icon='trash' size='mini' onClick={(e) => this._handleRemove(index)} />
              </Table.Cell>
            </Table.Row>)}
          </Table.Body>
        </Table>}
      </div>
    )
  }
}
