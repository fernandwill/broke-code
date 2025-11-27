import { query } from "../db/db";
import { Context } from "./context";
import bcrypt from "bcrypt";

const bcryptSaltRounds = 10;


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
        createUser: async (_: unknown, { email, name, password }: { email: string, name: string, password: string }) => {
            try { 
                const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds);
                const result = await query(
                    "INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name",
                    [email, name, hashedPassword]
                );
                return result.rows[0];
            } catch (err: any) {
                if (err?.code === "23505") {
                    throw new Error("User already exists.");
                }
                throw new Error(err.message ?? "Registration failed.");
            }
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
