import {client} from './graphql'
const newsOutput = `
  _id
  title
  longDescription
  shortDescription
  url
  originalImages {
    url
    name
  }
  url
  updatedAt
  createdAt
`
export const getNews = (page = 1, perPage = 20) => {
  return client().query(`
    query {
      viewer {
        data: newsPagination (page: ${page}, perPage: ${perPage}) {
          count
          items {
            ${newsOutput}
          }
        }
      }
    }
  `).then(data => data).catch(error => console.error(error))
}

export const newsCreate = (data) => {
  return client().query(`
    mutation ($data: CreateOnenewstypeInput!) {
      admin {
        newsCreate (record: $data) {
          recordId
        }
      }
    }
  `, {data}).then(data => data).catch(err => console.error(err))
}

export const newsSearch = ({text, limit = 10, skip = 0, operator = 'and'}) => {
  return client().query(`
    query {
      viewer {
        newsSearch(
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
              ${newsOutput}
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

export const getNewsById = id => {
  return client().query(`
    query {
      viewer {
        newsOne (filter: { _id: "${id}" }) {
          ${newsOutput}
        }
      }
    }
  `).then(result => {
    if (result && !result.errors) {
      return {data: result.data.viewer.newsOne}
    }
    return result
  })
}

export const updateNews = ({record, filter}) => {
  delete record._id
  return client().query(`
    mutation ($record: UpdateOnenewstypeInput!, $filter: FilterUpdateOnenewstypeInput) {
      admin {
        newsUpdateOne (record: $record, filter: $filter) {
          recordId
        }
      }
    }
  `, {record, filter}).then(result => {
    if (result && !result.errors) return {data: result.data.admin.newsUpdateOne}
    return result
  })
}
