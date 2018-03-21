import React, { Component } from 'react'
import {Segment, Button, Divider, Form} from 'semantic-ui-react'
import ThumbnailsList from '../../components/ThumbnailsList'
import Description from '../../components/Description'
import { newsCreate } from '../../actions/news';
import { toast } from 'react-toastify';
import ChangeTitle from '../../libs/ChangeTitle';

export default class CreateNews extends Component {
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

  _handleUpdateoriginalImages = (originalImages) => {
    this.setState({
      createData: {
        ...this.state.createData,
        originalImages
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
    const {createData} = this.state
    newsCreate({
      ...createData,
      originalImages: createData.originalImages[0]
    }).then(data => {
      if(!(data.errors && data.errors.length)) {
        toast.success('Create new news successfully!')
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
    ChangeTitle('Create News')
    const {createData, key} = this.state
    const {
      title = '',
      shortDescription = '',
      longDescription = ''
    } = createData
    return (
      <div key={key}>
        <h2>News Detail</h2>
        <Divider />
        <Segment.Group>
          <Segment>
            <h4>Thumbnails News</h4>
          </Segment>
          <Segment>
            <ThumbnailsList onDataCallback={this._handleUpdateoriginalImages} multiple={false}/>
          </Segment>
        </Segment.Group>
        <Segment.Group>
          <Segment><h4>News info</h4></Segment>
          <Segment>
            <div className='video-detail'>
              <div className="video__info">
                <Form>

                  <Description
                    onDataCallback={this._handleUpdateDescription}
                    data={{title, shortDescription, longDescription}}
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
