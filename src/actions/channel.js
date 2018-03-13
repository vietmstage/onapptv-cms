import {client} from './graphql'

export const getChannel = (page = 1) => {
  return client.query(`
    query {
      viewer {
        data: channelPagination (page: ${page}, perPage: 20) {
          count
          items {
            _id
            channelId
            title
            longDescription
            shortDescription
            originalImage {
              fileName
              name
              url
            }
          }
        }
      }
    }
  `).then(data => {
    return data
  }).catch(error => console.error(error))
}

export const channelCreate = (data) => {
  return client.query(`
    mutation ($data: CreateOneChannelModelInput!) {
      admin {
        channelCreate(record: $data) {
          recordId
        }
      }
    }
  `, {data}).then(result => result.data.admin.channelCreate).catch(err => console.error(err))
}

export const channelSearch = (text, limit = 10, skip = 0) => {
  return client.query(`
    query {
      viewer {
        channelSearch(q: "${text}", limit: ${limit}, skip: ${skip}) {
          count
          items: hits {
            _id
            data: fromMongo {
              _id
              title
              shortDescription
              originalImage {
                fileName
                url
                name
              }
            }
          }
        }
      }
    }
  `).then(result => {
    const data = result.data.viewer.channelSearch
    if(!data.items.length) return data
    const {count, items} = data
    let newData = {count, items: []}
    items.forEach(item => {
      item.data && newData.items.push(item.data)
    })
    return newData
  }).catch(err => console.error(err))
}