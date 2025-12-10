import { gql } from "graphql-tag";

export const typeDefs = gql`
    type User {
        id: ID!
        email: String!
        name: String
    }
    
    type AuthPayload {
        user: User!
        jwtToken: String!
    }

    type Query {
        health: String!
        users: [User!]!
        me: User
        problems: [Problem!]!
        problem(id: ID!): Problem
    }

    type Mutation {
        createUser(email: String!, name: String!, password: String!): User!
        userLogin(email: String!, password: String!): AuthPayload!
        logout: Boolean!
        setProblemState(problemId: ID!, input: ProblemStateInput!): ProblemUserState!
    }

    type Subscription {
        ping: String!
    }

    type Problem {
    id: ID!
    title: String!
    category: String!
    difficulty: String!
    likes: Int!
    dislikes: Int!
    order: Int!
    videoId: String
    link: String
    userState: ProblemUserState
    }

    type ProblemUserState {
    solved: Boolean!
    attempted: Boolean!
    bookmarked: Boolean!
    liked: Boolean!
    disliked: Boolean!
    }

    input ProblemStateInput {
    solved: Boolean
    attempted: Boolean
    bookmarked: Boolean
    liked: Boolean
    disliked: Boolean 
    }
`;
