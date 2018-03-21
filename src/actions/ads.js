import {client} from './graphql'

export const getAds = (page = 1, perPage = 20) => {
  return client.query(`
    query {
      viewer {
        data: adsPagination (page: ${page}, perPage: ${perPage}) {
          count
          items {
            _id
            deal
            url
            originalImages {
              url
              name
            }
            updatedAt
            createdAt
          }
        }
      }
    }
  `).then(data => data).catch(error => console.error(error))
}

export const adsCreate = (data) => {
  return client.query(`
    mutation ($data: CreateOneadstypeInput!) {
      admin {
        adsCreate (record: $data) {
          recordId
        }
      }
    }
  `, {data}).then(data => data).catch(err => console.error(err))
}

export const adsSearch = (text, limit = 10, skip = 0) => {
  return client.query(`
    query {
      viewer {
        adsSearch(q: "${text}", limit: ${limit}, skip: ${skip}) {
          count
          items: hits {
            _id
            data: fromMongo {
              _id
              deal
              url
              originalImages {
                url
                name
              }
            }
          }
        }
      }
    }
  `).then(result => {
    const data = result.data.viewer.adsSearch
    if(!data.items.length) return data
    const {count, items} = data
    let newData = {count, items: []}
    items.forEach(item => {
      item.data && newData.items.push(item.data)
    })
    return newData
  }).catch(err => console.error(err))
}