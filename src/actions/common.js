import {graphqlClient, client} from './graphql'
import gql from 'graphql-tag';
export const getGenres = () => {
  // return graphqlClient.query({
  //   query: gql`
  //     query {
  //       viewer {
  //         genresOptions: genreMany {
  //           value: _id
  //           text: name
  //         }
  //       }
  //     }
  //   `
  // }).then(data => data).catch(err => console.error(err))
  return client.query(`
    query {
      viewer {
        genresOptions: genreMany {
          value: _id
          text: name
        }
      }
    }
  `).then(data => data).catch(err => console.error(err))
}

export const createGenre = (name) => {
  // return graphqlClient.mutate({
  //   mutation: gql`
  //     mutation ($name: String) {
  //       admin {
  //         genreCreate (record: {name: $name}) {
  //           record {
  //             text: name
  //             value: _id
  //           }
  //         }
  //       }
  //     }
  //   `,
  //   variables: {
  //     name
  //   }
  // }).then(data => data).catch(err => console.error(err))
  const variables = {
    name
  }
  return client.query(`
    mutation ($name: String) {
      admin {
        genreCreate (record: {name: $name}) {
          record {
            text: name
            value: _id
          }
        }
      }
    }
  `, variables).then(data => data).catch(err => console.error(err))
}
