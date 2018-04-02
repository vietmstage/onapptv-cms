import {client} from './graphql'
const episodesOutput = `
  _id
  contentId
  durationInSeconds
  publishDate
  title
  longDescription
  shortDescription
  feature
  seriesId
  seasonIndex
  episodeIndex
  type
  impression
  state
  originalImages {
    url
    name
    fileName
  }
`
const seriesOutput = `
  _id
  contentId
  publishDate
  title
  longDescription
  shortDescription
  updatedAt
  createdAt
  originalImages {
    url
    name
    fileName
    scaledImage {
      height
      width
      url
    }
  }
  genreIds
  producerIds
  directorIds
  castIds
  tags
  allowedCountries
  episodes {
    ${episodesOutput}
  }
`
export const getSeries = (page = 1, perPage = 20, filter = {}) => {
  return client.query(`
    query ($filter: FilterFindManyseriestypeInput) {
      viewer {
        data: seriesPagination (page: ${page}, perPage: ${perPage}, filter: $filter) {
          count
          items {
            ${seriesOutput}
          }
        }
      }
    }
  `, {filter}).then(data => {
    return data
  }).catch(error => console.error(error))
}

export const seriesSearch = (text, limit = 30, skip = 0) => {
  return client.query(`
    query {
      viewer {
        seriesSearch(q: "${text}", limit: ${limit}, skip: ${skip}) {
          count
          items: hits {
            _id
            data: fromMongo {
              ${seriesOutput}
            }
          }
        }
      }
    }
  `).then(result => {
    const data = result.data.viewer.seriesSearch
    if(!data.items.length) return data
    const {count, items} = data
    let newData = {count, items: []}
    items.forEach(item => {
      item.data && newData.items.push(item.data)
    })
    return newData
  }).catch(err => console.error(err))
}

export const seriesCreate = (data) => {
  return client.query(`
    mutation ($data: CreateOneseriestypeInput!) {
      admin {
        seriesCreate(record: $data) {
          recordId
        }
      }
    }
  `, {data}).then(data => data).catch(err => console.error(err))
}

export const updateSeries = (data) => {
  return client.query(`
    mutation ($data: UpdateByIdseriestypeInput!) {
      admin {
        seriesUpdateById(record: $data) {
          recordId
          record {
            ${seriesOutput}
          }
        }
      }
    }
  `, {data}).then(result => {
    if (result && !result.errors) return {data: result.data.admin.seriesUpdateById}
    return result
  }).catch(err => console.error(err))
}

export const getSeriesById = id => {
  return client.query(`
    query {
      viewer {
        seriesById (_id: "${id}") {
          ${seriesOutput}
        }
      }
    }
  `).then(result => {
    if (result && !result.errors) {
      return {data: result.data.viewer.seriesById}
    }
    return result
  }).catch(err => console.error(err))
}

export const updateSeriesMany = (data, filter) => {
  return client.query(`
    mutation ($data: UpdateManyseriestypeInput!, $filter: FilterUpdateManyseriestypeInput) {
      admin {
        seriesUpdateMany (record: $data, filter: $filter) {
          numAffected
        }
      }
    }
  `, {data, filter}).then(result => {
    if (result && !result.errors) {
      return {data: result.data.admin.seriesUpdateMany}
    }
    return result
  }).catch(err => console.error(err))
}
