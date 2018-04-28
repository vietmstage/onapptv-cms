import React, { Component } from 'react'
import {Segment, Button, Divider, Form, Dimmer, Loader} from 'semantic-ui-react'
import ThumbnailsList from '../../components/ThumbnailsList'
import Description from '../../components/Description'
import { updateAds, getAdsById } from '../../actions/ads';
import { toast } from 'react-toastify';
import ChangeTitle from '../../libs/ChangeTitle';
import isEmpty from 'lodash/isEmpty'
export default class EditAds extends Component {
  static propTypes = {

  }

  state = {
    adsData: {},
    key: '',
    loadingAds: false,
    loading: false
  }

  componentDidMount () {
    const {match: {params: {adsId}}} = this.props
    if (adsId) {
      this.setState({loadingAds: true})
      getAdsById(adsId).then(result => {
        this.setState({loadingAds: false})
        if (result && !result.errors && result.data) {
          this.setState({adsData: result.data})
        } else {
          toast.error('Can not get news detail.')
        }
      })
    }
  }

  _handleAddNewItem = (targetOptions, value) => {
    this.setState({
      [targetOptions]: [{ text: value, value }, ...this.state[targetOptions]],
    })
  }
  _handleArrayChange = (e, { name, value }) => this.setState({ [name]: value })

  _handleInputChange = (e, {name, value}) => {
    let {adsData} = this.state
    adsData[name] = value
    this.setState({
      [name]: value,
      adsData
    })
  }

  _handleUpdateoriginalImages = (originalImages) => {
    this.setState({
      adsData: {
        ...this.state.adsData,
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
  
  _handleUpdate = () => {
    let {adsData} = this.state
    const { match: { params : {adsId: _id} }, history } = this.props
    this.setState({loading: true})
    updateAds({
      record: adsData,
      filter: {
        _id
      }
    }).then(data => {
      this.setState({loading: false})        
      if(!(data.errors && data.errors.length)) {
        toast.success('Update Ads successfully!')
        history.push('/ads/list')
        this.setState({
          adsData: {},
          key: new Date().getTime().toString()
        })
      } else {
        toast.error('Update Ads faield!!')
      }
    })
  }

  render() {
    ChangeTitle('Edit Ads')
    const {adsData, key, loadingAds, loading} = this.state

    if (loadingAds) return <div className='div__loading-full'><Dimmer inverted active><Loader /></Dimmer></div>

    if (!loadingAds && isEmpty(adsData)) return <Segment><i style={{color: '#999'}}>Sorry. There's nothing to show.</i></Segment>

    const {
      deal = '',
      originalImages = [],
      url = ''
    } = adsData
    return (
      <div key={key}>
        <h2>Ads Detail</h2>
        <Divider />
        <Segment.Group>
          <Segment>
            <h4>Thumbnails Ads</h4>
          </Segment>
          <Segment>
            <ThumbnailsList onDataCallback={this._handleUpdateoriginalImages} multiple={false} data={originalImages} isEdit/>
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
              <Button primary content='Update' onClick={this._handleUpdate} loading={loading}/>
            </div>
          </Segment>
        </Segment.Group>
      </div>
    )
  }
}
