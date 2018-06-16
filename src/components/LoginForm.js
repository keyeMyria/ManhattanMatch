import React, {Component} from 'react';
import firebase from 'firebase';
import {View,Text} from 'react-native';
import {Card,CardSection,Button,Spinner,Input, MyAppText} from './common';
import { SECONDARY_COLOR, PRIMARY_COLOR, BACKGROUND_COLOR } from '../variables';
import { ApolloConsumer, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import FBLoginButton from '../services/FBLoginButton';

const NEW_USER = gql`
mutation newUser($id: String!, $name: String!, $active: Boolean!, $email: String!, $gender: String!, $description: String, $school: String, $work: String, $sendNotifications: Boolean, $distance: Int, $token: String, $minAgePreference: Int, $maxAgePreference: Int, $pics: [String]) {
    newUser(id: $id, name: $name, active: $active, email: $email, gender: $gender, description: $description, school: $school, work: $work, sendNotifications: $sendNotifications, distance: $distance, token: $token, minAgePreference: $minAgePreference, maxAgePreference: $maxAgePreference, pics: $pics) {
        id
        name
        email
    }
  }
`

const SET_ID_LOCAL = gql`
mutation updateIdLocal($id: ID!) {
  updateIdLocal(id: $id) @client {
    id
    __typename
  }
}
`;

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            error: '',
            isLoading: false
        }
    }

    render() {
        return (
            <View style={styles.loginContainer}>
                <View style={styles.content}>
                    <MyAppText style={styles.title}>Manhattan Stag</MyAppText>
                    <MyAppText style={styles.errorTextStyle}>
                        {this.props.error}
                    </MyAppText>
                    <CardSection style={{borderBottomWidth: 0}}>
                        <Mutation mutation={NEW_USER}>
                        {(newUser) => {
                            const startNewUser = (user) => {
                                return newUser({variables: {
                                    id: user.id,
                                    name: user.name,
                                    active: user.active,
                                    email: user.email,
                                    gender: user.gender,
                                    description: user.description,
                                    school: user.school,
                                    work: user.work,
                                    sendNotifications: user.sendNotifications,
                                    distance: user.distance,
                                    token: user.token,
                                    latitude: user.latitude,
                                    longitude: user.longitude,
                                    minAgePreference: user.minAgePreference,
                                    maxAgePreference: user.maxAgePreference,
                                    pics: user.pics
                                }})
                            } 
                            return (
                                <Mutation mutation={SET_ID_LOCAL}>
                                {(setId) => {
                                    const startSetId = (id) => setId({variables: {id}})
                                    return (
                                        <ApolloConsumer>
                                            {client => <FBLoginButton client={client} startNewUser={startNewUser} startSetId={startSetId}/>}
                                        </ApolloConsumer>
                                    )
                                }}
                                </Mutation>
                            )
                        }}
                        </Mutation>
                    </CardSection>
                </View>
                <View style={{flex:1}}/>
            </View>
        )
    }
}

const styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    },
    buttonFBStyle: {
        backgroundColor: '#4C69BA'
    },
    buttonTextFBStyle: {
        color: "white"
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: BACKGROUND_COLOR
    },
    title: {
        fontSize: 32,
        color: PRIMARY_COLOR
    },
    content: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    }
}

export default LoginForm;