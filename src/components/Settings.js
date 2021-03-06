import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import {CirclePicture,Card,MyAppText,Spinner} from './common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PRIMARY_COLOR, PLACEHOLDER_PHOTO } from '../variables';
import {firebase} from '../firebase';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import {GET_PROFILE} from '../apollo/queries';
import {GET_ID} from '../apollo/local/queries';

const ICON_OPACITY = 0.75;
const ICON_SIZE = Dimensions.get('window').height *0.05;

class Settings extends React.Component {
    constructor(props) {
        super(props);
    }

    startLogout = () => firebase.auth().signOut();

    renderSubheading = (work,school) => {
        if (work || school) {
            if(school) {
                return (
                    <View style={styles.subHeading}>
                        <Ionicons name="md-school" size={14} color="black" style={styles.schoolText}/>
                        <MyAppText style={[styles.schoolText,{paddingLeft:4}]}>{school}</MyAppText>
                    </View>
                )
            } else {
                return (
                    <View style={styles.subHeading}>
                        <MaterialIcons name="work" size={14} color="black" style={styles.schoolText}/>
                        <MyAppText style={[styles.schoolText,{paddingLeft:4}]}>{work}</MyAppText>
                    </View>
                )
            }
        }
    }

    renderContent(user) {
        const {work, school, name, pics } = user;
        const profilePic = !!pics[0]? pics[0] : PLACEHOLDER_PHOTO
        return (
            <View style={styles.settingsContainer}>
                <View style={styles.miniProfile}> 
                    <CirclePicture size='large' imageURL={profilePic} auto={true}/>
                    <View style={styles.profileText}>
                        <MyAppText style={styles.nameText}>{name}</MyAppText>
                        {this.renderSubheading(work, school)}
                    </View>
                    <View style={styles.horizontalLine}/>
                </View>
                <View style={styles.options}>
                    <TouchableOpacity 
                        onPress={() => this.props.navigation.navigate('EditSettingsContainer')}
                        style={styles.buttons}
                    >
                        <Ionicons 
                            name="md-settings"
                            size={ICON_SIZE}
                            color="black"
                            style={{opacity:ICON_OPACITY}}
                        />
                        <MyAppText style={styles.optionText}>
                            Settings
                        </MyAppText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => this.props.navigation.navigate('EditProfile')}
                        style={styles.buttons}
                    >
                        <MaterialCommunityIcons 
                            name="account-edit"
                            size={ICON_SIZE}
                            color="black"
                            style={{opacity:ICON_OPACITY}}
                        />
                        <MyAppText style={styles.optionText}>
                            Edit Info
                        </MyAppText>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => this.startLogout()}
                        style={styles.buttons}
                    >
                        <MaterialCommunityIcons 
                            name="logout"
                            size={ICON_SIZE}
                            color="black"
                            style={{opacity:ICON_OPACITY}}
                        />
                        <MyAppText style={styles.optionText}>
                        Log out
                        </MyAppText>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    render() {
        return (
            <Query query={GET_ID}>
            {({ loading, error, data}) => {
                //console.log('local data: ',data);
                //console.log('local error: ',error);
                //console.log('local loading: ',loading);
                if(loading) return <Spinner />
                if(error) return <MyAppText>Error! {error.message}</MyAppText>
                
                const id = data.user.id;
                
                return (
                    <Query query={GET_PROFILE} variables={{id}}>
                        {({loading, error, data}) => {
                            //console.log('loading: ',loading);
                            //console.log('error: ',error);
                            //console.log('data: ',data);
                            if(loading) return <Spinner />
                            if(error) return <MyAppText>Error! {error.message}</MyAppText>
            
                            return this.renderContent(data.user)
                        }}
                    </Query>
                )
            }}
          </Query>
        )
    }
}

const styles = StyleSheet.create({
    settingsContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        margin:10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderBottomWidth: 0,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 2,
        shadowOpacity: 0.5,
        borderRadius: 10
    },
    miniProfile: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 20,
        minHeight: 100
    },
    profileText: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    options: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%'
    },
    optionText: {
        opacity: 0.7
    },
    nameText: {
        fontSize: 30,
        color: PRIMARY_COLOR,
        textAlign:'center',
        //fontFamily:'oxygen-regular'
    },
    schoolText: {
        fontSize: 14,
        opacity: 0.7
    },
    buttons: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    subHeading: {
        flexDirection: 'row',
        marginTop: 2
    },
    horizontalLine: {
        borderBottomColor:'black',
        borderBottomWidth:1,
        paddingVertical: 10,
        marginBottom: 10,
        flex:1
    },
});

export default Settings;
