import { AsyncStorage } from 'react-native';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { withClientState } from 'apollo-link-state';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { graphql } from 'react-apollo';
import {GRAPHQL_SERVER} from '../variables';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import {ApolloLink,split} from 'apollo-link';
import { persistCache } from 'apollo-cache-persist';
import gql from 'graphql-tag';
import {resolvers, typeDefs, defaults} from './localState';

// This file is the setup file for Apollo client

// Initiate the cache
const cache = new InMemoryCache();  

// persistCache allows apollo to store the cache or local state to AsyncStorage
// This works similar to redux-persist.
// persistCache({
//   cache,
//   storage: AsyncStorage
// })

// stateLink is the local graphql engine for state management
const stateLink = withClientState({
  cache,
  defaults,
  resolvers,
//  typeDefs
});

// We put both the state link and http link in httpLink to let the application 
// query the application state when applicable
const httpLink = ApolloLink.from([
    stateLink,
    new HttpLink({uri: `${GRAPHQL_SERVER}/graphql`})
]);

// Websockets are used for subscriptions.
const wsLink = new WebSocketLink({
    uri: 'ws://35.199.37.151:4000/subscriptions',
    options: {
        reconnect: true
    }
})

// The split function operates like a fi statement. If returned true, it hooks up to 
// the web sockets link. If false, it uses the http link.
const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
)

// At this point, the link encapsulates logic to determine if the application is trying 
// to access a subscription, graphql server, or state management.
export const client = new ApolloClient({
    link,
    cache,
    connectToDevTools: true,
    // experimental
   dataIdFromObject: object => object.id,
});

// enable remote debugging
// window.__APOLLO_CLIENT__ = client;

