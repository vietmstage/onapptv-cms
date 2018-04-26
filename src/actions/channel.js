import {client} from './graphql'
const channelOuput = `
  _id
  serviceId
  lcn
  title
  longDescription
  shortDescription
  updatedAt
  createdAt
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
  epgIds
  epgsData {
    videoId
    startTime
    endTime
    videoData {
      title
    }
  }
  metadata
`
export const getChannel = (page = 1, perPage = 20, filter = {}) => {
  return client().query(`
    query ($filter: FilterFindManychanneltypeInput) {
      viewer {
        data: channelPagination (page: ${page}, perPage: ${perPage}, filter: $filter) {
          count
          items {
            ${channelOuput}
          }
        }
      }
    }
  `, {filter}).then(data => {
    return data
  }).catch(error => console.error(error))
}

export const channelCreate = (data) => {
  return client().query(`
    mutation ($data: CreateOnechanneltypeInput!) {
      admin {
        channelCreate(record: $data) {
          recordId
        }
      }
    }
  `, {data}).then(result => result).catch(err => console.error(err))
}

export const channelSearch = (text, limit = 10, skip = 0) => {
  return client().query(`
    query {
      viewer {
        channelSearch(q: "${text}", limit: ${limit}, skip: ${skip}) {
          count
          items: hits {
            _id
            data: fromMongo {
              ${channelOuput}
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

export const channelAddEPGs = (channelId, recordIds) => {
  return client().query(`
    mutation ($recordIds: [String]) {
      admin {
        channelAddEPGs (
          _id: "${channelId}",
          recordIds: $recordIds
        ) {
          _id
        }
      }
    }
  `, {recordIds}).then(data => data).catch(err => console.error(err))
}

export const channelRemoveEPGs = (channelId, recordIds) => {
  return client().query(`
    mutation ($recordIds: [String]) {
      admin {
        channelRemoveEPGs (
          _id: "${channelId}",
          recordIds: $recordIds
        ) {
          _id
        }
      }
    }
  `, {recordIds}).then(data => data).catch(err => console.error(err))
}

export const getChannelById = id => {
  return client().query(`
    query {
      viewer {
        channelOne (filter: { _id: "${id}" }) {
          ${channelOuput}
        }
      }
    }
  `).then(result => {
    if (result && !result.errors) {
      return {data: result.data.viewer.channelOne}
    }
    return result
  })
}

export const updateChannel = data => {
  const _id = data._id
  delete data._id
  return client().query(`
    mutation ($data: UpdateOnechanneltypeInput!) {
      admin {
        channelUpdateOne (
          record: $data,
          filter: {
            _id: "${_id}"
          }
        ) {
          recordId
        }
      }
    }
  `, {data}).catch(err => console.error(err))
}

export const addEPG = data => {
  return client().query(`
    mutation ($data: CreateOneepgTypeInput!){
      admin {
        epgCreate(record: $data) {
          recordId
        }
      }
    }
  `, {data}).then(result => {
    if (result && !result.errors) {
      return {data: result.data.admin.epgCreate}
    }
    return result
  }).catch(err => console.error(err))
}

export const updateChannelMany = (data, filter) => {
  return client().query(`
    mutation ($data: UpdateOnechanneltypeInput!, $filter: FilterUpdateOnechanneltypeInput) {
      admin {
        channelUpdateOne (record: $data, filter: $filter) {
          recordId
        }
      }
    }
  `, {data, filter}).then(result => {
    if (result && !result.errors) {
      return {data: result.data.admin.channelUpdateOne}
    }
    return result
  }).catch(err => console.error(err))
}
