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


export const getPeople = (role) => {
  return client.query(`
    query {
      viewer {
        peoplePagination(
          page: 1,
          filter: {
            _operators: {
              role: {
                in: "${role}"
              }
            }
          }) {
          count
          items {
            text: name
            value: _id
          }
        }
      }
    }
  `).then(result => result.data.viewer.peoplePagination).catch(err => console.error(err))
}

export const createPeople = record => {
  return client.query(`
    mutation ($record: CreateOnePeopleModelInput!) {
      admin {
        peopleCreate (record: $record) {
          recordId
          record {
            name
            role
            _id
          }
        }
      }
    }
  `, {record}).then(result => result.data.admin.peopleCreate).catch(err => console.error(err))
}