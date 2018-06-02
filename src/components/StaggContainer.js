import {Text} from 'react-native';
import {Spinner} from './common';
import React,{Component} from 'react';
import { Query, Mutation } from 'react-apollo';
import GET_ID from '../queries/getId';
import Stagg from './Stagg';

const GET_MATCHES = gql`
query user($id: ID!) {
    user(id: $id) {
        matches {
            user:
                name
                pics
                age
                description
                work
                school
        }
    }
  }
`

const LIKE = gql`
mutation likeUser($id: ID!, $likedId: ID!) {
    likeUser(id: $id, likedId: $likedId) {
        id
        name
    }
}
`;
const DISLIKE = gql`
mutation dislikeUser($id: ID!, $dislikedId: ID!) {
    dislikeUser(id: $id, dislikedId: $dislikedId) {
        id
        name
    }
}
`;

class StaggContainer extends Component {

    render() {
        return (
            <Query query={GET_ID}>
                {({loading, error, data}) => {
                console.log('local data: ',data);
                console.log('local error: ',error);
                console.log('local loading: ',loading);
                if(loading) return <Spinner />
                if(error) return <Text>Error! {error.message}</Text>
                const { id } = data.user;
                return (
                    <Query query={GET_MATCHES} variables={{id}}>
                    {({loading, error, data}) => {
                        console.log('data: ',data);
                        console.log('error: ',error);
                        console.log('loading: ',loading);
                        if(loading) return <Spinner />
                        if(error) return <Text>Error! {error.message}</Text>
                        return <Mutation mutation={Like}>
                        {({likeUser}) => {
                            return <Mutation mutation={DISLIKE}>
                            {({dislikeUser}) => {
                                return <Stagg 
                                    matches={data.user.matches} 
                                    likeUser={likeUser}
                                    dislikeUser={dislikeUser}
                                />
                            }}
                            </Mutation>
                        }}
                        </Mutation>
                    }}
                    </Query>
                ) 
                }}
            </Query>
          )
    }
}

export default StaggContainer;
