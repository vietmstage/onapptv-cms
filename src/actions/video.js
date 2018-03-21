import {client} from './graphql'
const originalImages = `
  originalImages {
    fileName
    name
    url
    scaledImage {
      height
      width
      url
    }
  }
`
const videoOutput = `
  _id
  contentId
  durationInSeconds
  publishDate
  title
  longDescription
  shortDescription
  seriesId
  seasonIndex
  episodeIndex
  ${originalImages}
  type
  updatedAt
  createdAt
  genreIds
  producerIds
  directorIds
  tags
  feature
  allowedCountries
`
export const getVideos = (page = 1, perPage = 20) => {
  return client.query(`
    query {
      viewer {
        data: videoPagination (page: ${page}, perPage: ${perPage}) {
          count
          items {
            ${videoOutput}
          }
        }
      }
    }
  `).then(result => {
    if (result && !result.errors) {
      return {data: result.data.viewer.data}
    }
    return result
  }).catch(error => console.error(error))
}

export const getVideoByContentId = (contentId) => {
  return client.query(`
    query ($contentId: String!) {
      viewer {
        brightcoveSearchVideo(contentId: $contentId) {
          contentId
          durationInSeconds
          publishDate
          title
          longDescription
          shortDescription
          seriesId
          seasonIndex
          episodeIndex
          tags
          genreIds
          ${originalImages}
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
              ${videoOutput}
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

export const getVideoById = (id) => {
  return client.query(`
    query {
      viewer {
        videoById(_id: "${id}") {
          ${videoOutput}
        }
      }
    }
  `).then(result => {
    if (result && !result.errors) {
      return {data: result.data.viewer.videoById}
    }
    return result
  }).catch(err => console.error(err))
}

export const updateVideo = (data) => {
  return client.query(`
    mutation ($data: UpdateByIdvideotypeInput!){
      admin {
        videoUpdateById (record: $data) {
          recordId
        }
      }
    }
  `, {data}).then(result => {
    if (result && !result.errors) {
      return {data: result.data.admin.videoUpdateById}
    }
    return result
  })
}
