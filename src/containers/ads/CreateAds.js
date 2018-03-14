import React, { Component } from 'react'
import {Segment, Button, Divider, Form} from 'semantic-ui-react'
import ThumbnailsList from '../../components/ThumbnailsList'
import Description from '../../components/Description'
import { adsCreate } from '../../actions/ads';
import { toast } from 'react-toastify';
import ChangeTitle from '../../libs/ChangeTitle';
import { create } from 'domain';

export default class CreateAds extends Component {
  static propTypes = {

  }

  state = {
    createData: {},
    key: ''
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

  _handleUpdateOriginalImage = (originalImage) => {
    this.setState({
      createData: {
        ...this.state.createData,
        originalImage
      }
    })
  }

  _handleUpdateDescription = (data) => {
    this.setState({
      createData: {
        ...this.state.createData,
        ...data
      }
    })
  }
  
  _handleCreate = () => {
    let {createData} = this.state
    createData = {
      ...createData,
      deal: createData.title,
      originalImage: createData.originalImage[0]
    }
    delete createData.title
    adsCreate(createData).then(data => {
      if(!(data.errors && data.errors.length)) {
        toast.success('Create new Ads successfully!')
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
    const {createData, key} = this.state
    const {
      deal = '',
      shortDescription = '',
      longDescription = ''
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
            <ThumbnailsList onDataCallback={this._handleUpdateOriginalImage} multiple={false}/>
          </Segment>
        </Segment.Group>
        <Segment.Group>
          <Segment><h4>Ads info</h4></Segment>
          <Segment>
            <div className='video-detail'>
              <div className="video__info">
                <Form>

                  <Description
                    onDataCallback={this._handleUpdateDescription}
                    data={{deal, shortDescription, longDescription}}
                  />
                </Form>
              </div>
            </div>
          </Segment>
          <Segment>
            <div>
              <Button primary content='Create' onClick={this._handleCreate}/>
            </div>
          </Segment>
        </Segment.Group>
      </div>
    )
  }
}
