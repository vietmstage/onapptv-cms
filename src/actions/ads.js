import {client} from './graphql'
const adsOutput = `
  _id
  deal
  url
  originalImages {
    url
    name
  }
  updatedAt
  createdAt
`
export const getAds = (page = 1, perPage = 20) => {
  return client().query(`
    query {
      viewer {
        data: adsPagination (page: ${page}, perPage: ${perPage}) {
          count
          items {
            ${adsOutput}
          }
        }
      }
    }
  `).then(data => data).catch(error => console.error(error))
}

export const adsCreate = (data) => {
  return client().query(`
    mutation ($data: CreateOneadstypeInput!) {
      admin {
        adsCreate (record: $data) {
          recordId
        }
      }
    }
  `, {data}).then(data => data).catch(err => console.error(err))
}

export const adsSearch = ({text, limit = 10, skip = 0, operator = 'and'}) => {
  return client().query(`
    query {
      viewer {
        adsSearch(
          query: {
            query_string: {
              query: "${text}",
              default_operator: ${operator}
            }
          },
          limit: ${limit},
          skip: ${skip}
        ) {
          count
          items: hits {
            ${adsOutput}
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

export const getAdsById = id => {
  return client().query(`
    query {
      viewer {
        adsOne (filter: { _id: "${id}" }) {
          ${adsOutput}
        }
      }
    }
  `).then(result => {
    if (result && !result.errors) {
      return {data: result.data.viewer.adsOne}
    }
    return result
  })
}

export const updateAds = ({record, filter}) => {
  delete record._id
  return client().query(`
    mutation ($record: UpdateOneadstypeInput!, $filter: FilterUpdateOneadstypeInput) {
      admin {
        adsUpdateOne (record: $record, filter: $filter) {
          recordId
        }
      }
    }
  `, {record, filter}).then(result => {
    if (result && !result.errors) return {data: result.data.admin.adsUpdateOne}
    return result
  })
}
