import React, { Component } from 'react'
import {Segment, Button, Divider, Form} from 'semantic-ui-react'
import ThumbnailsList from '../../components/ThumbnailsList'
import { adsCreate } from '../../actions/ads';
import { toast } from 'react-toastify';
import ChangeTitle from '../../libs/ChangeTitle';

export default class CreateAds extends Component {
  state = {
    createData: {},
    key: '',
    loading: false
  }

  _handleAddNewItem = (targetOptions, value) => {
    this.setState({
      [targetOptions]: [{ text: value, value }, ...this.state[targetOptions]],
    })
  }
  _handleArrayChange = (e, { name, value }) => this.setState({ [name]: value })

  _handleInputChange = (e, {name, value}) => {
    let {createData} = this.state
    createData[name] = value
    this.setState({
      [name]: value,
      createData
    })
  }

  _handleUpdateoriginalImages = (originalImages) => {
    this.setState({
      createData: {
        ...this.state.createData,
        originalImages
      }
    })
  }

  // _handleUpdateDescription = (data) => {
  //   const {title: deal} = data
  //   delete data.title
  //   this.setState({
  //     adsData: {
  //       ...this.state.adsData,
  //       ...data,
  //       deal
  //     }
  //   })
  // }
  
  _handleCreate = () => {
    let {createData} = this.state
    // createData = {
    //   ...createData,
    //   deal: createData.title,
    // }
    // delete createData.title
    this.setState({loading: true})
    adsCreate(createData).then(data => {
      this.setState({loading: false})
      if(!(data.errors && data.errors.length)) {
        toast.success('Create new Ads successfully!')
        this.props.history.push('/ads/list')
        this.setState({
          createData: {},
          key: new Date().getTime().toString()
        })
      } else {
        toast.error('Create faield!!')
      }
    })
  }

  render() {
    ChangeTitle('Create Ads')
    const {createData, key, loading} = this.state
    const {
      deal = '',
      url = ''
    } = createData
    return (
      <div key={key}>
        <h2>Ads Detail</h2>
        <Divider />
        <Segment.Group>
          <Segment>
            <h4>Thumbnails Ads</h4>
          </Segment>
          <Segment>
            <ThumbnailsList onDataCallback={this._handleUpdateoriginalImages} multiple={false} />
          </Segment>
        </Segment.Group>
        <Segment.Group>
          <Segment><h4>Ads info</h4></Segment>
          <Segment>
            <div className='video-detail'>
              <div className="video__info">
                <Form>
                  <Form.Group widths='equal'>
                    <Form.Input
                      label='Deal:'
                      placeholder='Deal'
                      name='deal'
                      value={deal}
                      onChange={this._handleInputChange}
                    />
                    <Form.Input
                      label='Url:'
                      placeholder='Deal url:'
                      name='url'
                      value={url}
                      onChange={this._handleInputChange}
                    />
                  </Form.Group>
                </Form>
              </div>
            </div>
          </Segment>
          <Segment>
            <div style={{textAlign: 'right'}}>
              <Button primary content='Create' onClick={this._handleCreate} loading={loading}/>
            </div>
          </Segment>
        </Segment.Group>
      </div>
    )
  }
}
