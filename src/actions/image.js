import {graphqlClient, client} from './graphql'
import gql from 'graphql-tag';
import fetch from 'isomorphic-fetch'
export const getImageSign = (imageName, type) => {
  return client().query(`
    mutation ($imageName: String, $type: String) {
      admin {
        imageSignedUrl(fileName: $imageName, contentType: $type) {
          url
        }
      }
    }
  `, {imageName,type}).then(result => {
    if (result && !result.errors) return {data: result.data.admin.imageSignedUrl}
    return result
  }).catch(err => console.error(err))
  // return graphqlClient.mutate({
  //   mutation: gql`
  //     mutation ($imageName: String, $type: String) {
  //       admin {
  //         imageSignedUrl(fileName: $imageName, contentType: $type) {
  //           url
  //         }
  //       }
  //     }
  //   `,
  //   variables: {
  //     imageName,
  //     type
  //   }
  // }).then(data => data).catch(err => console.error(err))
}

export const uploadImage = (url, file) => {
  // const base64data = new Buffer(file, 'binary')
  // const formData = new FormData()
  // formData.append('Content-Type', file.type)
  // formData.append('Body', base64data)
  const blob = new Blob([file], {type: file.type})
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: blob
  }).then(res => res).catch(err => console.error(err))
  // const oReq = new XMLHttpRequest();
  // oReq.open("PUT", url, true);
  // oReq.setRequestHeader('Access-Control-Allow-Origin', '*')
  // oReq.onload = function (oEvent) {
  //   // UploadeXd.
  //   console.log(oEvent)
  // };

  // oReq.send(blob);
}