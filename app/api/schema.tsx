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
        createUser(email: String!, name: String!): User!
    }

    type Subscription {
        ping: String!
    }
`;

export const resolvers = {
    Query: { health: () => "ok" },
    Subscription: {
        ping: {
            subscribe: async function* () {
                while (true) {
                    yield { ping: "pong" };
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        }
    }
};