import {client} from './graphql'

export const getChannel = (page = 1) => {
  return client.query(`
    query {
      viewer {
        data: channelPagination (page: ${page}, perPage: 20) {
          count
          items {
            contentId
            originalImage
            title
            longDescription
            shortDescription
            thumbnails {
              url
              name
            }
          }
        }
      }
    }
  `).then(data => {
    return data
  }).catch(error => console.error(error))
}