import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form, Button, Label, Divider} from 'semantic-ui-react'
import {toast} from 'react-toastify'
export default class MetaData extends Component {
  static propTypes = {
    onUpdateMeta: PropTypes.func,
    metaData: PropTypes.object
  }

  state = {
    metaData: {},
    metaKey: '',
    metaValue: ''
  }

  componentDidMount () {
    if (this.props.metaData) {
      this.setState({metaData: this.props.metaData})
    }
  }

  _handleMetaChange = (key, value) => {
    let {metaData} = this.state
    const {onUpdateMeta} = this.props
    metaData[key] = value
    this.setState({metaData}, () => {
      onUpdateMeta && onUpdateMeta(metaData)
    })
  }

  _handleInputChange = (e, {name, value}) => this.setState({[name]: value})

  _handleAdd = () => {
    // let {metaData} = this.state
    const {onUpdateMeta} = this.props
    const {metaData, metaKey, metaValue} = this.state
    if (!metaKey || !metaValue) {
      toast.error('Please fill meta key and meta value.')
      return
    }
    metaData[metaKey] = metaValue
    this.setState({metaData, metaKey: '', metaValue: ''}, () => {
      onUpdateMeta && onUpdateMeta(metaData)
    })
  }

  _handleMetaRemove = (key) => {
    let {metaData} = this.state
    const {onUpdateMeta} = this.props
    delete metaData[key]
    this.setState({metaData}, () => {
      onUpdateMeta && onUpdateMeta(metaData)
    })
  }

  render () {
    const {metaData, metaKey, metaValue} = this.state
    return (
      <div style={{width: 400}}>
        <Form>
          {Object.keys(metaData).map((key, index) => <div key={index}>
            <MetaItem
              metaKey={key}
              metaValue={metaData[key]}
              onMetaChange={(data) => this._handleMetaChange(key, data)}
              onMetaRemove={() => this._handleMetaRemove(key)}
            />
          </div>)}
          {!!Object.keys(metaData).length && <Divider />}
          <div>
            <Form.Group widths='equal' style={{alignItems: 'flex-end'}}>
              <Form.Input
                label='New meta key'
                placeholder='New meta key'
                value={metaKey}
                name='metaKey'
                onChange={this._handleInputChange}
              />
              <Form.Input
                label='New meta key'
                placeholder='New meta key'
                value={metaValue}
                name='metaValue'
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
          </div>
        </Form>
      </div>
    )
  }
}

class MetaItem extends Component {
  static propTypes = {
    metaKey: PropTypes.string,
    metaValue: PropTypes.string,
    onMetaChange: PropTypes.func,
    onMetaRemove: PropTypes.func
  }

  shouldComponentUpdate (nextProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps)
  }
  render () {
    const {metaKey, metaValue} = this.props
    return (
      <Form.Group widths='equal'>
        <Form.Field style={{textAlign: 'right', alignSelf: 'center'}}>
          <Label content={metaKey} />
        </Form.Field>
        <Form.Input
          placeholder='Meta value'
          value={metaValue}
          onChange={(e, {value}) => this.props.onMetaChange(value)}
        />
        <Form.Field style={{width: 42}}>
          <Button
            icon='close'
            style={{
              width: 29,
              height: 29,
              margin: 0,
              padding: 0
            }}
            onClick={this.props.onMetaRemove}
          />
        </Form.Field>
      </Form.Group>
    )
  }
}