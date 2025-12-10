import { query } from "../db/db";
import { Context } from "./context";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { DBProblem } from "@/app/utils/types/problem";
import {getRedisClient} from "./redis";

type ProblemUserStateRow = {
    solved: boolean;
    attempted: boolean;
    bookmarked: boolean;
    liked: boolean;
    disliked: boolean;
};

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

            const redis = await getRedisClient();
            const cacheKey = `user:${context.user.sub}`;

            if (redis) {
                const cached = await redis.get(cacheKey).catch(() => null);
                if (cached) return JSON.parse(cached);
            }

            const result = await query(
                "SELECT * FROM users WHERE id = $1",
                [context.user.sub]
            );

            const user = result.rows[0];

            if (redis && user) {
                await redis.set(cacheKey, JSON.stringify(user), {EX: 300}).catch(() => null);
            }

            return user;
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
                const user = result.rows[0];

                const redis = await getRedisClient();
                if (redis) {
                    await redis.set(`user:${user.id}`, JSON.stringify(user), {EX: 300}).catch(() => null);
                }

                return user;
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

                const redis = await getRedisClient();
                if (redis && user) {
                    await redis.set(`user:${user.id}`, JSON.stringify({id: user.id, email: user.email, name: user.name}), {EX: 300}).catch(() => null);
                }

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
        },
        logout: async (_: unknown, __: unknown, context: Context) => {
            if (!context.user) throw new Error("Not authenticated.");
            const redis = await getRedisClient();
            if (redis) await redis.del(`user:${context.user.sub}`).catch(() => null);
            return true;
        },
        setProblemState: async (
            _parent: unknown,
            {problemId, input}: {problemId: string; input: Partial<ProblemUserStateRow>},
            context: Context
        ) => {
            if (!context.user) throw new Error("Not authenticated.");
            const {solved, attempted, bookmarked, liked, disliked} = input;
            const existing = await query(
                "SELECT solved, attempted, bookmarked, liked, disliked FROM problem_user_state WHERE user_id = $1 AND problem_id = $2",
                [context.user.sub, problemId]
            );

            const prev: ProblemUserStateRow = existing.rows[0] ?? {
                solved: false,
                attempted: false,
                bookmarked: false,
                liked: false,
                disliked: false,
            };

            const next: ProblemUserStateRow = {
                solved: solved ?? prev.solved,
                attempted: attempted ?? prev.attempted,
                bookmarked: bookmarked ?? prev.bookmarked,
                liked: liked ?? prev.liked,
                disliked: disliked ?? prev.disliked,
            };

            // keep liked/disliked mutually exclusive
            if (next.liked) next.disliked = false;
            if (next.disliked) next.liked = false;

            const likesDelta = (next.liked ? 1 : 0) - (prev.liked ? 1 : 0);
            const dislikesDelta = (next.disliked ? 1 : 0) - (prev.disliked ? 1 : 0);

            const result = await query(
                `INSERT INTO problem_user_state (user_id, problem_id, solved, attempted, bookmarked, liked, disliked)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT (user_id, problem_id) DO UPDATE SET
                    solved = EXCLUDED.solved,
                    attempted = EXCLUDED.attempted,
                    bookmarked = EXCLUDED.bookmarked,
                    liked = EXCLUDED.liked,
                    disliked = EXCLUDED.disliked,
                    updated_at = now()
                 RETURNING solved, attempted, bookmarked, liked, disliked`,
                [context.user.sub, problemId, next.solved, next.attempted, next.bookmarked, next.liked, next.disliked]
            );

            if (likesDelta !== 0 || dislikesDelta !== 0) {
                await query(
                    "UPDATE problems SET likes = GREATEST(likes + $1, 0), dislikes = GREATEST(dislikes + $2, 0) WHERE id = $3",
                    [likesDelta, dislikesDelta, problemId]
                );
            }

            return result.rows[0];
        }
    },
    Problem: {
        userState: async (parent: {id: string}, _args: unknown, context: Context): Promise<ProblemUserStateRow | null> => {
            if (!context.user) return null;
            const res = await query(
                "SELECT solved, attempted, bookmarked, liked, disliked FROM problem_user_state WHERE user_id = $1 AND problem_id = $2", [context.user.sub, parent.id]
            );
            if (res.rowCount === 0) return {solved: false, attempted: false, bookmarked: false, liked: false, disliked: false};
            return res.rows[0];
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
