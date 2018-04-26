import React, { Component } from 'react'
import {Segment, Button, Divider, Form, Dimmer, Loader} from 'semantic-ui-react'
import ThumbnailsList from '../../components/ThumbnailsList'
import Description from '../../components/Description'
import { toast } from 'react-toastify';
import ChangeTitle from '../../libs/ChangeTitle';
import {getNewsById, updateNews} from '../../actions/news'
import isEmpty from 'lodash/isEmpty'
export default class EditNews extends Component {
  static propTypes = {

  }

  state = {
    newsData: {},
    key: '',
    loadingNews: false
  }

  componentDidMount () {
    const {match: {params: {newsId}}} = this.props
    if (newsId) {
      this.setState({loadingNews: true})
      getNewsById(newsId).then(result => {
        this.setState({loadingNews: false})
        if (result && !result.errors && result.data) {
          this.setState({newsData: result.data})
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
    let {newsData} = this.state
    newsData[name] = value
    this.setState({
      [name]: value,
      newsData
    })
  }

  _handleUpdateoriginalImages = (originalImages) => {
    this.setState({
      newsData: {
        ...this.state.newsData,
        originalImages
      }
    })
  }

  _handleUpdateDescription = (data) => {
    this.setState({
      newsData: {
        ...this.state.newsData,
        ...data
      }
    })
  }
  
  _handleUpdate = () => {
    const { newsData } = this.state
    const { match: { params : {newsId: _id} }, history } = this.props
    updateNews({
      record: newsData,
      filter: {
        _id
      }
    }).then(data => {
      if(!(data.errors && data.errors.length)) {
        toast.success('Update news successfully!')
        history.push('/news/list')
        this.setState({
          newsData: {},
          key: new Date().getTime().toString()
        })
      } else {
        toast.error('Update news faield!!')
      }
    })
  }

  render() {
    ChangeTitle('Create News')

    const {newsData, key, loadingNews} = this.state
    if (loadingNews) return <div className='div__loading-full'><Dimmer inverted active><Loader /></Dimmer></div>

    if (!loadingNews && isEmpty(newsData)) return <Segment><i style={{color: '#999'}}>Sorry. There's nothing to show.</i></Segment>
    
    const {
      title = '',
      shortDescription = '',
      longDescription = '',
      originalImages = []
    } = newsData
    return (
      <div key={key}>
        <h2>News Detail</h2>
        <Divider />
        <Segment.Group>
          <Segment>
            <h4>Thumbnails News</h4>
          </Segment>
          <Segment>
            <ThumbnailsList onDataCallback={this._handleUpdateoriginalImages} multiple={false} data={originalImages} isEdit/>
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
            <div style={{textAlign: 'right'}}>
              <Button primary content='Update' onClick={this._handleUpdate}/>
            </div>
          </Segment>
        </Segment.Group>
      </div>
    )
  }
}
