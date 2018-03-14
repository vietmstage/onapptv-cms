import {graphqlClient, client} from './graphql'
import gql from 'graphql-tag';
export const getVideos = (page = 1, perPage = 20) => {
  return client.query(`
    query {
      viewer {
        data: videoPagination (page: ${page}, perPage: ${perPage}) {
          count
          items {
            _id
            contentId
            duration_in_seconds
            publishDate
            title
            longDescription
            shortDescription
            seriesId
            seasonIndex
            episodeIndex
            originalImage {
              fileName
              name
              url
            }
            type
            updatedAt
            createdAt
          }
        }
      }
    }
  `).then(data => data).catch(error => console.error(error))
}

export const getVideoDetail = (contentId) => {
  return client.query(`
    query ($contentId: String!) {
      viewer {
        brightcoveSearchVideo(contentId: $contentId) {
          contentId
          duration_in_seconds
          publishDate
          title
          longDescription
          shortDescription
          seriesId
          seasonIndex
          episodeIndex
          tags
          genreIds
          originalImage {
            fileName
            name
            scaledImage {
              height
              width
              url
            }
          }
          type
        }
        videoOne(filter:{contentId: $contentId}) {
          _id
        }
      }
    }
  `, {contentId}).then(data => data).catch(err => console.error(err))
}

export const createVideo = (data) => {
  return client.query(`
    mutation ($data: CreateOnevideotypeInput!) {
      admin {
        videoCreate(record: $data) {
          recordId
        }
      }
    }
  `, {data}).then(data => data).catch(err => console.error(err))
}

export const videoSearch = (text, limit = 10, skip = 0) => {
  return client.query(`
    query {
      viewer {
        videoSearch(q: "${text}", limit: ${limit}, skip: ${skip}) {
          count
          items: hits {
            _id
            data: fromMongo {
              _id
              title
              shortDescription
              duration_in_seconds
              originalImage {
                url
                name
              }
            }
          }
        }
      }
    }
  `).then(result => {
    const data = result.data.viewer.videoSearch
    if(!data.items.length) return data
    const {count, items} = data
    let newData = {count, items: []}
    items.forEach(item => {
      item.data && newData.items.push(item.data)
    })
    return newData
  }).catch(err => console.error(err))
}

export const updateSeriesId = (seriesId, ids) => {
  return client.query(`
    mutation ($seriesId: MongoID, $ids: [MongoID]){
      admin {
        videoUpdateMany (
          record: {
            seriesId: $seriesId
          },
          filter: {
            _ids: $ids
          }
        ) {
          numAffected
        }
      }
    }
  `, {seriesId, ids}).then(result => result).catch(err => console.error(err))
}