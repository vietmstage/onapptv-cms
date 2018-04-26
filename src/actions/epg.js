import {client} from './graphql'
export const getEpgList = ({page = 1, perPage = 20}) => {
  return client().query(`
    query {
      viewer {
        epgPagination (page: ${page}, perPage: ${perPage}) {
          count
          items {
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
          }
        }
      }
    }
  `).then(result => {
    if (result && !result.errors) return {data: result.data.viewer.epgPagination}
    return result
  }).catch(err => console.error(err))
}
