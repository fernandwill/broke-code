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
    }

    type Mutation {
        createUser(email: String!, name: String!, password: String!): User!
        userLogin(email: String!, password: String!): AuthPayload!
    }

    type Subscription {
        ping: String!
    }
`;
