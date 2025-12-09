import { query } from "../db/db";
import { Context } from "./context";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { DBProblem } from "@/app/utils/types/problem";

type DBerror = { code?: string; message?: string };

type DBProblemRow = {
    id: string;
    title: string;
    category: string;
    difficulty: string;
    likes: number;
    dislikes: number;
    order_num: number;
    video_id?: string | null;
    link?: string | null;
}

const isDBError = (err: unknown): err is DBerror => {
    return typeof err === "object" && err !== null;
}

const mapProblemRow = (row: DBProblemRow): DBProblem => ({
    id: row.id,
    title: row.title,
    category: row.category,
    difficulty: row.difficulty,
    likes: row.likes,
    dislikes: row.dislikes,
    order: row.order_num,
    videoId: row.video_id ?? undefined,
    link: row.link ?? undefined,
});

const bcryptSaltRounds = 10;

export const resolvers = {
    Query: {
        health: () => "ok",
        users: async () => {
            const result = await query("SELECT * FROM users");
            return result.rows;
        },

        me: async (_parent: unknown, _args: unknown, context: Context) => {
            if (!context.user) throw new Error("Not authenticated.");

            const result = await query(
                "SELECT * FROM users WHERE id = $1",
                [context.user.sub]
            );

            return result.rows[0];
        },

        problems: async (): Promise<DBProblem[]> => {
            const result = await query("SELECT id, title, category, difficulty, likes, dislikes, order_num, video_id, link FROM problems ORDER BY order_num ASC");
            return result.rows.map(mapProblemRow);
        },
        problem: async (_parent: unknown, { id }: { id: String }): Promise<DBProblem | null> => {
            const result = await query("SELECT id, title, category, difficulty, likes, dislikes, order_num, video_id, link FROM problems WHERE id = $1", [id]) as unknown as { rows: DBProblemRow[] };
            const row = result.rows[0];
            return row ? mapProblemRow(row) : null;
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

        userLogin: async (_: unknown, { email, password }: { email: string; password: string }) => {
            try {
                const result = await query(
                    "SELECT id, email, name, password_hash FROM users WHERE email = $1",
                    [email]
                );
                const user = result.rows[0];
                if (!user) throw new Error("Invalid email or password.");

                const passwordValid = await bcrypt.compare(password, user.password_hash);
                if (!passwordValid) throw new Error("Invalid email or password.");

                const jwtToken = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: "7d" }
                );
                return { jwtToken, user: { id: user.id, email: user.email, name: user.name } };
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
