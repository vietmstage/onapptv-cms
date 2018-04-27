import {client} from './graphql'
const epgOutput = `
  videoId
  channelId
  genreIds
  startTime
  endTime
  _id
  videoData {
    _id
    title
  }
  channelData {
    _id
    title
  }
`
export const getEpgList = ({page = 1, perPage = 20, filter = {}}) => {
  return client().query(`
    query ($filter: FilterFindManyepgtypeInput) {
      viewer {
        epgPagination (page: ${page}, perPage: ${perPage}, filter: $filter) {
          count
          items {
            ${epgOutput}
          }
        }
      }
    }
  `, {filter}).then(result => {
    if (result && !result.errors) return {data: result.data.viewer.epgPagination}
    return result
  }).catch(err => console.error(err))
}

export const epgSearch = ({text, limit = 10, skip = 0, operator = 'and'}) => {
  return client().query(`
    query {
      viewer {
        epgSearch(
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
              ${epgOutput}
            }
          }
        }
      }
    }
  `).then(result => {
    const data = result.data.viewer.epgSearch
    if(!data.items.length) return data
    const {count, items} = data
    let newData = {count, items: []}
    items.forEach(item => {
      item.data && newData.items.push(item.data)
    })
    return newData
  }).catch(err => console.error(err))
}

export const epgUpdate = ({record, filter}) => {
  return client().query(`
    mutation ($record: UpdateOneepgtypeInput!, $filter: FilterUpdateOneepgtypeInput) {
      admin {
        epgUpdateOne (record: $record, filter: $filter) {
          recordId
        }
      }
    }
  `, {record, filter}).then(result => {
    if (result && !result.errors) return {data: result.data.admin.epgUpdateOne}
    return result
  }).catch(err => console.error(err))
}
