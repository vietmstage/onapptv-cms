import {client} from './graphql'

export const getSeries = (page = 1, perPage = 20) => {
  return client.query(`
    query {
      viewer {
        data: seriesPagination (page: ${page}, perPage: ${perPage}) {
          count
          items {
            contentId
            publishDate
            title
            longDescription
            shortDescription
            updatedAt
            createdAt
          }
        }
      }
    }
  `).then(data => {
    return data
  }).catch(error => console.error(error))
}