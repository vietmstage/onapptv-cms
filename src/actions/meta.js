
import {client} from './graphql'
import fetch from 'isomorphic-fetch'

export const getFileSign = (payload) => {
  return client.query(`
    mutation ($fileName: String, $version: Float, $contentType: String) {
      admin {
        fileSignedUrl(fileName: $fileName, version: $version, contentType: $contentType) {
          url
          expiredAt
        }
      }
    }
  `, {...payload}).then(result => {
    if (result && !result.errors) return {data: result.data.admin.fileSignedUrl}
    return result
  })
}

export const uploadFile = ({url, file}) => {
  const blob = new Blob([file], {type: file.type})
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/xml'
    },
    body: blob
  }).then(res => res).catch(err => console.error(err))
}

export const fileCreate = record => {
  return client.query(`
    mutation ($record: CreateOneconfigtypeInput!) {
      admin {
        fileCreate (record: $record) {
          recordId
        }
      }
    }
  `, {record}).then(result => {
    if (result && !result.errors) return {data: result.data.admin.fileCreate}
    return result
  })
}

export const getMetaList = ({page = 1, perPage = 20}) => {
  return client.query(`
    query {
      viewer {
        filePagination (page: ${page}, perPage: ${perPage}) {
          count
          items {
            _id
            name
            version
            url
            createdAt
            updatedAt
          }
        }
      }
    }
  `).then(result => {
    if (result && !result.errors) return {data: {...result.data.viewer.filePagination}}
    return result
  })
}
