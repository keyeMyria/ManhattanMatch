import {firebase} from './index.js';
import RNFetchBlob from 'react-native-fetch-blob';

// const Blob = RNFetchBlob.polyfill.Blob
// const fs = RNFetchBlob.fs
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
// window.Blob = Blob

// const uploadImage = (uri, imageName, mime = 'image/jpg') => {
//     console.log('upload image');
//     console.log('uri: ',uri);
//     console.log('imageName: ',imageName);
//   return new Promise((resolve, reject) => {
//     const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
//       let uploadBlob = null
//       const imageRef = firebase.storage().ref('posts').child(imageName)
//       fs.readFile(uploadUri, 'base64')
//       .then((data) => {
//         return Blob.build(data, { type: `${mime};BASE64` })
//       })
//       .then((blob) => {
//         uploadBlob = blob
//         return imageRef.put(blob, { contentType: mime })
//       })
//       .then(() => {
//         uploadBlob.close()
//         return imageRef.getDownloadURL()
//       })
//       .then((url) => {
//         resolve(url)
//       })
//       .catch((error) => {
//         reject(error)
//       })
//   })
// }

const uploadImage = (uri, imageName) => {
  console.log('upload Image uri: ',uri);
  console.log('upload Image name: ',imageName);
  //return Blob.build(uri, {type: 'image/png;base64'})
  return Blob.build(RNFetchBlob.wrap(uri), {type: 'text/plain'})
    .then((blob) => {
      console.log('after blob build');
      imageRef = firebase.storage().ref('images').child(imageName).put(blob, {contentType: "image/png" })
      .then(snapshot => blob.close)
      .catch(e => console.log('error closing blob: ',e))
    })
    .catch(e => console.log('error uploading image: ',e))
}

export {uploadImage}