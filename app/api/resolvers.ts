import { query } from "../db/db";
import { Context } from "./context";

export const resolvers = {
    Query: {
        health: () => "ok",
        users: async () => {
            // 1. Write standard SQL
            const result = await query("SELECT * FROM users");
            // 2. Return the rows directly
            return result.rows;
        },

        me: async (_parent: unknown, _args: unknown, context: Context) => {
            if (!context.user) throw new Error("Not authenticated");

            // Parameterized query ($1) prevents SQL injection
            const result = await query(
                "SELECT * FROM users WHERE id = $1",
                [context.user.sub]
            );

            return result.rows[0];
        }
    },

    Mutation: {
        createUser: async (_: unknown, { email, name }: { email: string, name: string }) => {
            const result = await query(
                "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *",
                [email, name]
            );
            return result.rows[0];
        }
    },

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
