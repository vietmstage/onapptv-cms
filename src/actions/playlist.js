import {client} from './graphql'
const playlistOutput = `
  title
  longDescription
  shortDescription
  typeId
  type
  state
  createdAt
  updatedAt
  projectId
  _id
  typeData
`
export const getPlaylist = (page = 1, perPage = 20, filter = {}) => {
  return client().query(`
    query ($filter: FilterFindManyplaylisttypeInput) {
      viewer {
        data: playlistPagination (page: ${page}, perPage: ${perPage}, filter: $filter) {
          count
          items {
            ${playlistOutput}
          }
        }
      }
    }
  `, {filter}).then(data => {
    return data
  }).catch(error => console.error(error))
}

export const playlistSearch = ({text, limit = 30, skip = 0, operator = 'and'}) => {
  return client().query(`
    query {
      viewer {
        playlistSearch(
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
              ${playlistOutput}
            }
          }
        }
      }
    }
  `).then(result => {
    const data = result.data.viewer.playlistSearch
    if(!data.items.length) return data
    const {count, items} = data
    let newData = {count, items: []}
    items.forEach(item => {
      item.data && newData.items.push(item.data)
    })
    return newData
  }).catch(err => console.error(err))
}

export const playlistCreate = (data) => {
  return client().query(`
    mutation ($data: CreateOneplaylisttypeInput!) {
      admin {
        playlistCreate(record: $data) {
          recordId
        }
      }
    }
  `, {data}).then(data => data).catch(err => console.error(err))
}

export const updatePlaylist = (data) => {
  const _id = data._id
  delete data._id
  return client().query(`
    mutation ($data: UpdateOneplaylisttypeInput!) {
      admin {
        playlistUpdateOne(
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
    if (result && !result.errors) return {data: result.data.admin.playlistUpdateOne}
    return result
  }).catch(err => console.error(err))
}

export const getPlaylistById = id => {
  return client().query(`
    query {
      viewer {
        playlistOne (
          filter: {
            _id: "${id}"
          }
        ) {
          ${playlistOutput}
        }
      }
    }
  `).then(result => {
    if (result && !result.errors) {
      return {data: result.data.viewer.playlistOne}
    }
    return result
  }).catch(err => console.error(err))
}

export const updatePlaylistMany = (data, filter) => {
  return client().query(`
    mutation ($data: UpdateManyplaylisttypeInput!, $filter: FilterUpdateManyplaylisttypeInput) {
      admin {
        playlistUpdateMany (record: $data, filter: $filter) {
          numAffected
        }
      }
    }
  `, {data, filter}).then(result => {
    if (result && !result.errors) {
      return {data: result.data.admin.playlistUpdateMany}
    }
    return result
  }).catch(err => console.error(err))
}
