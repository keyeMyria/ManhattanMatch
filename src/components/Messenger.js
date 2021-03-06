import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {db} from '../firebase';
import {CirclePicture,MyAppText} from './common';
import gql from 'graphql-tag';
import {GET_MESSAGES} from '../apollo/queries';

class Messenger extends Component {
    
    constructor(props) {
        super(props);
    }
    
    // While in the chat window, listen for chat updates
    componentDidMount = () => {
        this.unsubscribe = this.props.subscribeToNewMessages();
    }

    // Stop listening for new messages when the chat window is not up.
    componentWillUnmount = () => this.unsubscribe();

    // This function is called when a new message is sent.
    sendNewMessage = (messages) => {
        console.log('in sendNewMessage');
        console.log('messages: ',messages);

        // If messages is array, we may need to change
        const now = new Date().getTime();

        // We are currently only sending 1 message at a time, but since RN Gifted Chat sends us an
        // array, we process it using a forEac method
        messages.forEach(message => {
            this.props.newMessage({
                variables: {
                    avatar: this.props.pic,
                    name: this.props.name,
                    uid: message.user._id,
                    // id: now,
                    matchId: this.props.matchId,
                    // The message object returns an array.
                    text: message.text,
                    _id: message._id,
                    order: -1 * now,
                },
                // OptimisticResponse is processed by update as soon as a message is sent by the newMessage
                // above. When the mutation's response comes back, update is re-ran with the real response. 
                // Apollo knows which entry to update by the _id field assigned to the message.
                optimisticResponse: {
                    __typename: "Mutation",
                    newMessage: {
                        avatar: this.props.pic,
                        name: this.props.name,
                        uid: message.user._id,
                        matchId: this.props.matchId,
                        text: message.text,
                        //text: 'optimistic',
                        order: -1 * now,
                        _id: message._id,
                        __typename: 'MessageItem',
                        createdAt: now,
                    }
                },
                // function is used to update our cache with the mutation response
                update: (store, data) => {
                    
                    // Read the cache
                    let storeData = store.readQuery({ 
                        query: GET_MESSAGES, 
                        variables: {id:this.props.matchId}
                    });

                    // unshift() places the value in the front of the array.
                    storeData.messages.list.unshift(data.data.newMessage);

                    // Write back into the cache with the new message.
                    store.writeQuery({query: GET_MESSAGES, data: storeData});

                },
            })
        })
    }

    // This is only in place for debuging purposes.
    // componentWillReceiveProps = (nextProps) => {
    //     if(nextProps.messages.map(message => message.text) !== this.props.messages.map(message => message.text)) {
    //         console.log('messages change');
    //         console.log('old messages: ',this.props.messages.map(message => message.text));
    //         console.log('new messages: ',nextProps.messages.map(message => message.text));
    //     }
    // }
    
    render() {
        return (
        <View style={styles.messengerContainer}>
            <GiftedChat 
                messages={this.props.messages}
                onSend={(message) => this.sendNewMessage(message)}
                user={{_id:`${this.props.id}`,name: this.props.name, avatar: this.props.pic}}
                showUserAvatar={false}
                onPressAvatar={(user) => this.props.navigation.navigate('UserProfile',{id:user._id,name:user.name})}
                // The following 3 variables relate to pagination.
                loadEarlier={!!this.props.cursor}
                onLoadEarlier={() => this.props.fetchMoreMessages()}
                isLoadEarlier={true}
            />
        </View>
        )
    }
}

const styles = StyleSheet.create({
    messengerContainer: {
        flex: 1,
        alignItems: 'stretch',
        marginLeft: 0,
        marginRight: 0
    },
    textHeader: {
        alignSelf: 'center',
        textAlign: 'center',
        fontWeight:'bold',
        fontSize: 18,
        color: '#000',
        paddingLeft: 8
    },
    headerViewStyle: {
        flexDirection: 'row',
        paddingVertical: 5
    }
});

export default Messenger;