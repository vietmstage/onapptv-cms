import {client} from './graphql'
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
`
export const getSeries = (page = 1, perPage = 20) => {
  return client.query(`
    query {
      viewer {
        data: seriesPagination (page: ${page}, perPage: ${perPage}) {
          count
          items {
            ${seriesOutput}
          }
        }
      }
    }
  `).then(data => {
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

export const seriesUpdate = (id, data) => {
  return client.query(`
    mutation ($id: MongoID, $data: UpdateManyseriestypeInput!) {
      admin {
        seriesUpdateMany(record: $data, filter: {
          _id: $id
        }) {
          numAffected
        }
      }
    }
  `, {id, data}).then(result => result).catch(err => console.error(err))
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
