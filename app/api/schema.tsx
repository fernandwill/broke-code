import {gql} from "graphql-tag";

export const typeDefs = gql`
    type Query {health: String!}
    type Subscription {ping: String!}
    `;

export const resolvers = {
    Query: {health: () => "ok"},
    Subscription: {
        ping: {
            subscribe: async function* () {
                while (true) {
                    yield {ping: "pong"};
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        }
    }
};