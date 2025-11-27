import { gql } from "graphql-tag";

export const typeDefs = gql`
    type User {
        id: ID!
        email: String!
        name: String
    }

    type Query {
        health: String!
        users: [User!]!
        me: User
    }

    type Mutation {
        createUser(email: String!, name: String!, password: String!): User!
    }

    type Subscription {
        ping: String!
    }
`;
