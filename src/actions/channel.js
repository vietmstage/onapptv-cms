import {client} from './graphql'
const channelOuput = `
  _id
  channelId
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
`
export const getChannel = (page = 1) => {
  return client.query(`
    query {
      viewer {
        data: channelPagination (page: ${page}, perPage: 20) {
          count
          items {
            ${channelOuput}
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
  return client.query(`
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

export const channelAddEPGs = (channelId, records) => {
  return client.query(`
    mutation ($records: [EPGModelInput]) {
      admin {
        channelAddEPGs (
          _id: "${channelId}",
          records: $records
        ) {
          channelId
        }
      }
    }
  `, {records}).then(data => data).catch(err => console.error(err))
}

export const channelRemoveEPGs = (channelId, epgId) => {
  return client.query(`
    mutation {
      admin {
        channelRemoveEPGs (
          _id: "${channelId}",
          epgId: "${epgId}"
        ) {
          channelId
        }
      }
    }
  `).then(data => data).catch(err => console.error(err))
}

export const getChannelById = id => {
  return client.query(`
    query {
      viewer {
        channelById (_id: "${id}") {
          ${channelOuput}
        }
      }
    }
  `).then(result => {
    if (result && !result.errors) {
      return {data: result.data.viewer.channelById}
    }
    return result
  })
}

export const updateChannel = data => {
  return client.query(`
    mutation ($data: UpdateByIdchanneltypeInput!) {
      admin {
        channelUpdateById (record: $data) {
          recordId
        }
      }
    }
  `, {data})
}

export const addEPG = data => {
  return client.query(`
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
