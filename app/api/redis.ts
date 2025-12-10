import {createClient, RedisClientType} from "redis";

let client: RedisClientType | null = null;
let connectPromise: Promise<RedisClientType | void> | null = null;

export async function getRedisClient(): Promise<RedisClientType | null> {
    if (!client) {
        const url = process.env.REDIS_URL;
        client = createClient({url});
        client.on("error", (err) => console.error("Redis error", err));
        connectPromise = client.connect().catch((err) => {
            console.error("Redis connection error", err);
            client = null;
            throw err;
        });
    }
    try {
        if (connectPromise) await connectPromise;
        return client;
    } catch {
        return null; 
    }
}