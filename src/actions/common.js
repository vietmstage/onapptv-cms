import {client} from './graphql'

export const getGenres = () => {
  return client().query(`
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
  const variables = {
    name
  }
  return client().query(`
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
  return client().query(`
    query {
      viewer {
        peoplePagination(
          page: 1,
          filter: {
            _operators: {
              roles: {
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
  return client().query(`
    mutation ($record: CreateOnepeopletypeInput!) {
      admin {
        peopleCreate (record: $record) {
          recordId
          record {
            name
            roles
            _id
          }
        }
      }
    }
  `, {record}).then(result => result.data.admin.peopleCreate).catch(err => console.error(err))
}

const configOutput = `
  name
  version
  url
  type
  _id
`

export const getConfig = ({ filter, skip = 0, limit = 100 }) => {
  return client().query(`
    query ($filter: FilterFindManyconfigtypeInput) {
      viewer {
        fileMany (filter: $filter) {
          ${configOutput}
        }
      }
    }
  `, { filter }).then(result => {
    if (result && !result.errors) return {data: result.data.viewer.fileMany}
    return result
  }).catch(err => console.error(err))
}

export const configCreate = ({ record }) => {
  return client().query(`
    mutation ($record: CreateOneconfigtypeInput!) {
      admin {
        configCreate ( record: $record ) {
          recordId
          record {
            ${configOutput}
          }
        }
      }
    }
  `, { record }).then(result => {
    if (result && !result.errors) return {data: result.data.admin.configCreate || {}}
    return result
  }).catch(err => console.error(err))
}

export const configRemove = (_id) => {
  return client().query(`
    mutation {
      admin {
        fileRemoveOne (
          filter: {
            _id: "${_id}"
          }
        ) {
          recordId
        }
      }
    }
  `).then(result => {
    if (result && !result.errors) return {data: result.data.admin.fileRemoveOne || {}}
    return result
  })
}
