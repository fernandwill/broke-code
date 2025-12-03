import { query } from "../db/db";
import { Context } from "./context";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type DBerror = {code?: string; message?: string};

const isDBError = (err: unknown): err is DBerror {
    return typeof err === "object" && err !== null;
}

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
            } catch (err: unknown) {
                if (isDBError(err) && err.code === "23505") {
                    throw new Error("User already exists.");
                }
                const message = err instanceof Error ? err.message : "Registration failed.";
                throw new Error(message);
            }
        },

        userLogin: async (_: unknown, {email, password}: {email: string; password: string}) => {
            try {
                const result = await query(
                    "SELECT id, email, name, password_hash FROM users WHERE email = $1",
                    [email]
                );
                const user = result.rows[0];
                if (!user) throw new Error("Invalid email or password.");

                const passwordValid = await bcrypt.compare(password, user.password_hash);
                if (!passwordValid) throw new Error("Invalid email or password.");

                const jwtToken = jwt.sign({sub: user.id, email: user.email}, process.env.JWT_SECRET as string, {expiresIn: "7d"}
                );
                return {jwtToken, user: {id: user.id, email: user.email, name: user.name}};
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message.trim() : "Login failed.";
                throw new Error(message);
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
