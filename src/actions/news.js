import {client} from './graphql'

export const getNews = (page = 1, perPage = 20) => {
  return client.query(`
    query {
      viewer {
        data: newsPagination (page: ${page}, perPage: ${perPage}) {
          count
          items {
            _id
            title
            longDescription
            shortDescription
            url
            originalImage {
              url
              name
            }
            url
            updatedAt
            createdAt
          }
        }
      }
    }
  `).then(data => data).catch(error => console.error(error))
}

export const newsCreate = (data) => {
  return client.query(`
    mutation ($data: CreateOnenewstypeInput!) {
      admin {
        newsCreate (record: $data) {
          recordId
        }
      }
    }
  `, {data}).then(data => data).catch(err => console.error(err))
}

export const newsSearch = (text, limit = 10, skip = 0) => {
  return client.query(`
    query {
      viewer {
        newsSearch(q: "${text}", limit: ${limit}, skip: ${skip}) {
          count
          items: hits {
            _id
            data: fromMongo {
              _id
              title
              longDescription
              shortDescription
              url
              originalImage {
                url
                name
              }
              url
              updatedAt
              createdAt
            }
          }
        }
      }
    }
  `).then(result => {
    const data = result.data.viewer.newsSearch
    if(!data.items.length) return data
    const {count, items} = data
    let newData = {count, items: []}
    items.forEach(item => {
      item.data && newData.items.push(item.data)
    })
    return newData
  }).catch(err => console.error(err))
}