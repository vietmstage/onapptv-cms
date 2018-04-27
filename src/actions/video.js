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
  castIds
  tags
  feature
  allowedCountries
  metadata
`
export const getVideos = (page = 1, perPage = 20, filter = {}) => {
  return client().query(`
    query ($filter: FilterFindManyvideotypeInput) {
      viewer {
        data: videoPagination (page: ${page}, perPage: ${perPage}, filter: $filter) {
          count
          items {
            ${videoOutput}
          }
        }
      }
    }
  `, {filter}).then(result => {
    if (result && !result.errors) {
      return {data: result.data.viewer.data}
    }
    return result
  }).catch(error => console.error(error))
}

export const getVideoByContentId = (contentId, type = 'brightcove') => {
  let func = 'brightcoveSearchVideo'
  if (type === 'youtube') func = 'youtubeSearchVideo'
  if (type === 'vimeo') func = 'vimeoSearchVideo'
  return client().query(`
    query ($contentId: String!) {
      viewer {
        ${func}(contentId: $contentId) {
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
  `, {contentId}).then(result => {
    if (result && !result.errors) return {data: result.data.viewer[func], videoOne: result.data.viewer.videoOne || null}
    return result
  }).catch(err => console.error(err))
}

export const createVideo = (data) => {
  return client().query(`
    mutation ($data: CreateOnevideotypeInput!) {
      admin {
        videoCreate(record: $data) {
          recordId
        }
      }
    }
  `, {data}).then(data => data).catch(err => console.error(err))
}

export const videoSearch = ({text, limit = 10, skip = 0, operator = 'and'}) => {
  return client().query(`
    query {
      viewer {
        videoSearch(
          query: {
            bool: {
              must: {
                query_string: {
                  query: "${text}",
                  default_operator: ${operator}
                }
              }
            }
          },
          limit: ${limit},
          skip: ${skip}
        ) {
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
  return client().query(`
    mutation ($seriesId: MongoID, $ids: [MongoID]){
      admin {
        videoUpdateOne (
          record: {
            seriesId: $seriesId
          },
          filter: {
            _ids: $ids
          }
        ) {
          recordId
        }
      }
    }
  `, {seriesId, ids}).then(result => result).catch(err => console.error(err))
}

export const getVideoById = (id) => {
  return client().query(`
    query {
      viewer {
        videoOne(
          filter: {
            _id: "${id}"
          }
        ) {
          ${videoOutput}
        }
      }
    }
  `).then(result => {
    if (result && !result.errors) {
      return {data: result.data.viewer.videoOne || {}}
    }
    return result
  }).catch(err => console.error(err))
}

export const updateVideo = (data) => {
  const _id = data._id
  delete data._id
  return client().query(`
    mutation ($data: UpdateOnevideotypeInput!){
      admin {
        videoUpdateOne (
          record: $data,
          filter: {
            _id: "${_id}"
          }
        ) {
          recordId
        }
      }
    }
  `, {data}).then(result => {
    if (result && !result.errors) {
      return {data: result.data.admin.videoUpdateOne || {}}
    }
    return result
  }).catch(err => console.error(err))
}

export const updateVideoMany = (data, filter) => {
  return client().query(`
    mutation ($data: UpdateOnevideotypeInput!, $filter: FilterUpdateOnevideotypeInput) {
      admin {
        videoUpdateOne (record: $data, filter: $filter) {
          recordId
        }
      }
    }
  `, {data, filter}).then(result => {
    if (result && !result.errors) {
      return {data: result.data.admin.videoUpdateOne || {}}
    }
    return result
  }).catch(err => console.error(err))
}
