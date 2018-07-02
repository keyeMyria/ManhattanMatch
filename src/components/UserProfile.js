import React, {Component} from 'react';
import {
  View, 
  Text, 
  StyleSheet,
  Image, 
  ScrollView, 
  Dimensions, 
  ImageBackground,
  TouchableWithoutFeedback } from 'react-native';
// import {connect} from 'react-redux';
import getUserProfile from '../selectors/getUserProfile';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import UserProfilePhotos from './UserProfilePhotos';
import { MyAppText,Spinner } from './common';
import { PRIMARY_COLOR } from '../variables';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const GET_PROFILE = gql`
query user($id: String!) {
  user(id: $id) {
      id
      name
      work
      school
      pics
      description
  }
}
`

class UserProfile extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      loaded: false,
    }

    //this.pics = [this.props.user.profilePic, ...this.props.user.ancillaryPics];
  }

  static navigationOptions = ({navigation,screenProps}) => {
    //console.log('screenProps: ',screenProps);
    return {
    title: `${navigation.state.params.name}`,
    headerRight: (<View></View>),
    headerTitleStyle: 
        {
            alignSelf: 'center',
            textAlign: 'center',
            fontWeight:'normal',
            fontSize: 22,
            color: PRIMARY_COLOR
        },
        headerStyle: {paddingTop:0,marginTop:0,height:35}
      }
    }

  render() {
    //console.log('props: ',this.props); 
    
    const {userProfileContainer,userPics,userInfo,iconText,userPhoto,touchablePics,
      nameText,subHeading,schoolText,userDescription,leftClicker,rightClicker,
      picIndicator} = styles; 

      console.log('id: ',this.props.navigation.state.params.id);

    return (
      <Query query={GET_PROFILE} variables={{id: this.props.navigation.state.params.id}}>
      {({loading, error, data}) => {
        console.log('loading: ',loading);
        console.log('error: ',error);
        console.log('data: ',data);
        if(loading) return <Spinner />
        if(error) return <MyAppText>Error! {error.message}</MyAppText>
        const {name, school, work, description,pics} = data.user;  
        
        return (
          <View style={userProfileContainer}>
            <UserProfilePhotos 
              pics={pics}
              cacheImages={true}
            />
            <ScrollView>
              <View style={userInfo}>
                <MyAppText style={nameText}>{name}</MyAppText>
                {!!school && (
                  <View style={subHeading}>
                    <Ionicons name="md-school" size={14} color="black" style={iconText}/>
                    <MyAppText style={schoolText}>{school}</MyAppText>
                  </View>
                )}
                {!!work && (
                  <View style={subHeading}>
                    <MaterialIcons name="work" size={14} color="black" style={iconText}/>
                    <MyAppText style={[schoolText,{paddingLeft:4}]}>{work}</MyAppText>
                  </View>
                )}  
                </View>
                <View style={styles.horizontalLine}/>
              <View style={userDescription}>
                {!!description && <MyAppText>{description}</MyAppText>}
              </View>
            </ScrollView>
          </View>
        )
      }}
      </Query>
    )
  }

}

const styles = StyleSheet.create({
  userProfileContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  userInfo: {
    paddingLeft: 10,
    marginTop: 10,
    
  },
  schoolText: {
    fontSize: 14,
    opacity: 0.7,
    paddingLeft: 5
  },
  iconText: {
    fontSize: 14,
    opacity: 0.7,
  },

  nameText: {
    fontSize: 28,
    color: PRIMARY_COLOR
  },
  userDescription: {
    flex: 1,
    paddingLeft: 10
  },
  subHeading: {
    flexDirection: 'row'
  },
  horizontalLine: {
    borderBottomColor:'black',
    borderBottomWidth:1,
    paddingVertical: 10,
    marginBottom: 10,
    opacity: 0.3
  },
})

// const mapStateToProps = (state, ownProps) => {
//   //console.log('id: ',ownProps.navigation.state.params.id);
//   //console.log('matchListReducer: ',state.matchListReducer)
//   return {
//     // Returns matches profile
//     user: getUserProfile(ownProps.navigation.state.params.id,
//       [...state.matchListReducer.matches, ...state.matchListReducer.queue])
//   }
// }

export default UserProfile;