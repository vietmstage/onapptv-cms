import {graphqlClient, client} from './graphql'
import gql from 'graphql-tag';
export const getVideos = (page = 1, perPage = 20) => {
  return client.query(`
    query {
      viewer {
        data: videoPagination (page: ${page}, perPage: ${perPage}) {
          count
          items {
            contentId
            duration_in_seconds
            publishDate
            title
            longDescription
            shortDescription
            seriesId
            seasonIndex
            episodeIndex
            originalImage {
              fileName
              name
              url
              scaledImage {
                height
                width
                url
              }
            }
            type
            updatedAt
            createdAt
          }
        }
      }
    }
  `).then(data => data).catch(error => console.error(error))
}

export const getVideoDetail = (contentId) => {
  return client.query(`
    query ($contentId: String!) {
      viewer {
        brightcoveSearchVideo(contentId: $contentId) {
          contentId
          duration_in_seconds
          publishDate
          title
          longDescription
          shortDescription
          seriesId
          seasonIndex
          episodeIndex
          originalImage {
            fileName
            name
            scaledImage {
              height
              width
              url
            }
          }
          type
        }
        videoOne(filter:{contentId: $contentId}) {
          _id
        }
      }
    }
  `, {contentId}).then(data => data).catch(err => console.error(err))
}

export const createVideo = (data) => {
  // const videoData = {
  //   title: data.title,
  //   contentId: data.contentId,
  //   duration_in_seconds: data.duration_in_seconds
  // }
  // return graphqlClient.mutate({
  //   variables: {...data},
  //   mutation: gql`
  //     mutation (
  //       $title: String,
  //       $tags: [String],
  //       $contentId: String,
  //       $duration_in_seconds: Float,
  //       $shortDescription: String,
  //       $longDescription: String,
  //       $thumbnails: [input {
  //         url: String
  //       }]
  //     ) {
  //       admin {
  //         videoCreate(record: {
  //           title: $title
  //           tags: $tags,
  //           contentId: $contentId,
  //           duration_in_seconds: $duration_in_seconds,
  //           shortDescription: $shortDescription,
  //           longDescription: $longDescription,
  //           thumbnails: $thumbnails
  //         }) {
  //           recordId
  //         }
  //       }
  //     }
  //   `
  // }).then(data => data).catch(err => console.error(err))

  return client.query(`
    mutation ($data: CreateOnevideotypeInput!) {
      admin {
        videoCreate(record: $data) {
          recordId
        }
      }
    }
  `, {data}).then(data => data).catch(err => console.error(err))
}