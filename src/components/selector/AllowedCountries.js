import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form} from 'semantic-ui-react'
import DropDown from '../common/Dropdown'

export default class AllowedCountries extends Component {
  static propTypes = {
    onDataCallback: PropTypes.func,
    allowedCountries: PropTypes.array
  }

  state = {
    allowedCountries: [],
    allowedCountriesOptions: []
  }
  
  componentDidMount() {
    const {allowedCountries} = this.props
    this.setState({
      allowedCountries: [...(allowedCountries || [])]
    })
  }

  componentWillReceiveProps (nextProps) {
    if(JSON.stringify(this.props.allowedCountries) !== JSON.stringify(nextProps.allowedCountries) && JSON.stringify(nextProps.allowedCountries) !== JSON.stringify(this.state.allowedCountries)) {
      this.setState({
        allowedCountries: [...(nextProps.allowedCountries || [])]
      })
    }
  }
  

  _handleAddNewItem = (targetOptions, value) => {
    this.setState({
      [targetOptions]: [{ text: value, value }, ...this.state[targetOptions]],
    })
  }

  _handleInputChange = (e, {name, value}) => {
    const {onDataCallback} = this.props
    this.setState({
      [name]: value
    }, () => onDataCallback && onDataCallback(this.state.allowedCountries))
  }

  render() {
    const {allowedCountries, allowedCountriesOptions} = this.state
    return (
      <Form.Field>
        <label>Allowed Countries</label>
        <DropDown
          name='allowedCountries'
          options={allowedCountriesOptions}
          placeholder='Choose allowed countries'
          search selection multiple fluid allowAdditions
          value={allowedCountries}
          onAddItem={(e, {value}) =>this._handleAddNewItem('allowedCountriesOptions', value)}
          onChange={this._handleInputChange}
        />
      </Form.Field>
    )
  }
}
