import React, { Component } from 'react';
import { View } from 'react-native';
import { LoginButton, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import {firebase} from '../firebase';
import gql from 'graphql-tag';
import uploadImage from '../firebase/uploadImage';

const GET_EMAIL_BY_TOKEN = gql`
query user($id: String!) {
    user(id: $id) {
        email
    }
}
`

class FBLoginButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <LoginButton
          //publishPermissions={["email","public_profile","user_photos","user_birthday","user_hometown"]}
          readPermissions={['public_profile','email','user_photos','user_birthday','user_hometown','user_gender']}
          onLoginFinished={
            async (error, result) => {
              console.log('error: ',error);
              console.log('result: ',result)
              if (error) {
                alert("Login failed with error: " + error.message);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                const tokenRaw = await AccessToken.getCurrentAccessToken();
                const token = tokenRaw.accessToken.toString();

                console.log('token: ',token);

                // Determine if user is registered.

                // const provider = firebase.auth.FacebookAuthProvider;
                // const credential = provider.credential(token);
                const credential = firebase.auth.FacebookAuthProvider.credential(tokenRaw.accessToken)
                
                //console.log('credential: ',credential);
                console.log('Before firebase auth');
                const result = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
                console.log('after firebase auth');
                let email;
                let isRegistered;
                try {
                  // Login via Firebase Auth
                  email = result.additionalUserInfo.profile.email;
  
                  // const responseEmailRaw = await fetch(`https://graph.facebook.com/me/?fields=email&access_token=${token}`)
                  // const responseEmail = await responseEmailRaw.json();
  
                  console.log('email: ',email);

                  const {data, error} = await this.props.client.query({query: GET_EMAIL_BY_TOKEN, variables: {id: email}, fetchPolicy:"no-cache"})
                  console.log('data: ',data);
                  console.log('error: ',error);
                  isRegistered = !!data.user? !!data.user.email : false;
                  console.log('isRegistered: ',isRegistered);
                } catch(e) {
                  email = null;
                  isRegistered = false;
                }

                // If we do not have record of the user's email, this is a new user.
                // We should build their profile from their facebook profile
                if(!isRegistered) {
                  console.log('new user');
                  // An alternative approach would be to run this all on the graphql server
                  const responseRaw = await fetch(`https://graph.facebook.com/me/?fields=first_name,last_name,picture.height(300),education,about,gender,email&access_token=${token}`)
                  const response = await responseRaw.json();
                  
                  console.log('response: ',response);

                  const photosRaw = await fetch(`https://graph.facebook.com/me/photos/?fields=source.height(300)&limit=5&access_token=${token}`)
                  const photos = await photosRaw.json();

                  console.log('photos: ',photos);

                  const profilePic = await uploadImage(response.picture.data.url);
                  const ancillaryPics = await Promise.all(photos.data.map(async (datum) => {return await uploadImage(datum.source)}));
                  
                  //const ancillaryPics = [];
                  const pics = [profilePic, ...ancillaryPics];

                  const newUser = {
                    // By default the profilePic property will contain the user's profile pic along with the next
                    // 5 photos the user is tagged in.
                    pics,
                    name: response.first_name,
                    active: true,
                    school: response.education?response.education[response.education.length -1].school.name:'',
                    description: response.about,
                    gender: !!response.gender ? response.gender : 'male',
                    email: response.email,
                    id: response.email,
                    //coords: coords.coords,
                    sendNotifications: true, // default
                    distance: 15, // default
                    minAgePreference: 18, // default
                    maxAgePreference: 28, // default
                  }

                  console.log('newUser: ',newUser);

                  // Load up new user in our database
                  await this.props.startNewUser(newUser);
                }

                await this.props.startSetId(response.email);

                console.log('fb login complete');
                
              }
            }
          }
          onLogoutFinished={async () => {
            return await firebase.auth().signOut()
          }
          }
          >
          </LoginButton>
      </View>
    );
  }
};

export default FBLoginButton;