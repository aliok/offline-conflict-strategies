const { ApolloServer, gql } = require('apollo-server');


const feedback = [
{
    id: 1,
    author: 1,
    text: 'How versioning works with GraphQL?',
    votes: 7
},
{
    id: 2,
    author: 2,
    text: 'Is GraphQL another Hype?',
    votes: 53
}
]

const users = [
{
    id: 1,
    name: 'Stephen',
    dateOfBirth: '2018-10-15T14:52:31.888Z'
},
{
    id: 2,
    name: 'Wojciech',
    dateOfBirth: '2014-10-15T14:52:38.376Z'
},
{
    id: 3,
    name: 'Passos',
    dateOfBirth: '2018-10-15T17:42:38.376Z'
},
{
    id: 4,
    name: 'Dara',
    dateOfBirth: '2015-10-15T09:51:18.376Z'
}
]

// Schema
const typeDefs = gql`
type Feedback {
    id: ID!
    text: String!
    votes: Int!
    author: User!
}

type User {
    id: ID!
    name: String!
    dateOfBirth: String!
    feedback: [Feedback]
}
type Query {
    allFeedbacks: [Feedback],
    getFeedback(id: Int!): Feedback,
    allUsers: [User],
    getUser(id: Int!): User
}

type Mutation {
    createUser(name: String!, dateOfBirth: String!): User
    updateUser(id: ID!, name: String, dateOfBirth: String): User
    deleteUser(id: ID!): User
    deleteFeedback(id: ID!): Feedback
    createFeedback(text: String!, votes: Int!, author: ID!): Feedback
    updateFeedback(id: ID!, text: String, votes: Int, author: ID!): Feedback
    ## Increment counter for specific feedback
    vote(id: ID!, userId: ID!): Feedback
}
`

// Resolvers define the technique for fetching the types in the
// schema.
const resolvers = {
Query: {
    allFeedbacks: () => feedback,
    allUsers: () => users,
    getFeedback: (obj, args, context, info) => {
    for (let value of feedback) {
        if (args.id == value.id) {
        return value
        }
    }
    throw new Error(`Couldn't find feedback with id ${id}`)
    },
    getUser: (obj, args, context, info) => {
    for (let value of users) {
        if (args.id == value.id) {
        return value
        }
    }
    throw new Error(`Couldn't find user with id ${id}`)
    }
},

Mutation: {
    createUser: (obj, args, context, info) => {
    args.id = new Date().getTime()
    users.push(args)
    return args
    },
    updateUser: (obj, args, context, info) => {
    for (let user of users) {
        if (args.id == user.id) {
        user.name = args.name
        user.feedback = args.feedback
        user.dateOfBirth = args.dateOfBirth
        return user
        }
    }
    throw new Error(`Couldn't find user with id ${args.id}`)
    },
    deleteUser: (obj, args, context, info) => {
    for (var i = 0; i < users.length; i++) {
        if (args.id == users[i].id) {
        let returningUser = users[i]
        users.splice(i, 1)
        return returningUser
        }
    }
    throw new Error(`Couldn't find user with id ${args.id}`)
    },
    createFeedback: (obj, args, context, info) => {
    args.id = new Date().getTime()
    feedback.push(args)
    return args
    },
    updateFeedback: (obj, args, context, info) => {
    for (let item of feedback) {
        if (args.id == item.id) {
        item.votes = args.votes
        item.author = args.author
        item.text = args.text
        return item
        }
    }
    throw new Error(`Couldn't find feedback with id ${args.id}`)
    },
    deleteFeedback: (obj, args, context, info) => {
    for (var i = 0; i < feedback.length; i++) {
        if (args.id == feedback[i].id) {
        let returningFeedback = feedback[i]
        feedback.splice(i, 1)
        return returningFeedback
        }
    }
    throw new Error(`Couldn't find user with id ${args.id}`)
    },
    vote: (obj, args, context, info) => {
    for (let item of feedback) {
        if (args.id === item.id) {
        item.votes += 1
        return item
        }
    }
    throw new Error(`Couldn't find feedback with id ${args.id}`)
    }
}
}

const apolloServer = new ApolloServer({
typeDefs,
resolvers,
playground: {
    settings: {
    'editor.theme': 'light',
    'editor.cursorShape': 'block'
    },
    tabs: [{
    responses: ['{}'],
    query: `
        query allUsers {
        allUsers{
        id
        name
        feedback{
            id
            text
        }
        }
    }

    query allFeedbacks{
        allFeedbacks{
        id
        text
        votes
        }
    }

    query getFeedback{
        getFeedback(id: 1){
        id
        text
        votes
        }
    }

    query getUser{
        getUser(id: 1){
        id
        name
        }
    }

    mutation createUser{
        createUser(name: "SomeoneElse"){
        id
        name
        }
    }

    mutation updateUser{
        updateUser(id:1, name: "idiot"){
        id
        name
        }
    }

    mutation deleteUser{
        deleteUser(id:1){
        id
        name
        }
    }

    mutation deleteFeedback{
        deleteFeedback(id:1){
        id
        }
    }
        `
    }]
}
})

apolloServer.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
