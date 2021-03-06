const typeDefs = `
    type User {
        id: String!
        active: Boolean
        name: String
        email: String
        age: Int
        description: String
        school: String
        work: String
        sendNotifications: Boolean
        gender: String
        distance: Int
        token: String
        latitude: Float
        longitude: Float
        minAgePreference: Int
        maxAgePreference: Int
        match: Boolean
        distanceApart: Float
        order: Float
        registerDateTime: String
        pics: [String]
        profilePic: String
        likes: [User]
        dislikes: [User]
        matches(otherId: String): [Match]
        queue: Queue
    }

    type Queue {
        list: [User]
        cursor: Float
    }
    
    type MessageItem {
        name: String
        avatar: String
        _id: String
        createdAt: String
        text: String
        order: Float
        uid: String
    }
    
    type Message {
        id: String 
        cursor: String
        list: [MessageItem]!
    }

    type LikeUser {
        id: String
        user: User
        match: Boolean
        matchId: String
    }

    type Match {
        matchId: String
        user: User
        messages: Message
        lastMessage: MessageItem
    }

    type Query {
        user(id: String!): User
        messages(id: String!): Message
        moreMessages(id: String!, cursor: String!): Message
        moreQueue(id: String!, cursor: Float!): Queue
    }

    type Subscription {
        newMessageSub(matchId: String, id: String): MessageItem
    }

    type Mutation {
        dislikeUser (
            id: String! 
            dislikedId: String!
        ): User
        likeUser (
            id: String!
            likedId: String!
        ): LikeUser
        editUser (
            id: String!
            name: String
            active: Boolean
            email: String
            gender: String
            age: Int
            description: String
            school: String
            work: String
            sendNotifications: Boolean
            distance: Int
            token: String
            latitude: Float
            longitude: Float
            registerDateTime: String
            minAgePreference: Int
            maxAgePreference: Int
            pics: [String]
        ): User
        newUser (
            id: String!
            name: String
            active: Boolean
            email: String
            gender: String
            age: Int
            description: String
            school: String
            work: String
            sendNotifications: Boolean
            distance: Int
            token: String
            latitude: Float
            longitude: Float
            registerDateTime: String
            minAgePreference: Int
            maxAgePreference: Int
            pics: [String]
        ): User
        newMessage (
            matchId: String! 
            name: String 
            text: String
            createdAt: String
            avatar: String
            order: Float
            uid: String
            _id: String
        ): MessageItem
    }

    schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
    }
`;

export default typeDefs;