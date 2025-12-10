import "dotenv/config";
import http from "http";
import cors from "cors";
import express, { Request } from "express";
import { json } from "body-parser";
import { ApolloServer } from "@apollo/server";
import { WebSocketServer } from "ws";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { useServer } from "graphql-ws/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";
import {
    Context,
    buildHttpContext,
    buildWsContext
} from "./context.js";

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());

const httpServer = http.createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Setup WebSocket Server
const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql"
});

const serverCleanup = useServer(
    {
        schema,
        context: async (ctx: {connectionParams?: Readonly<Record<string, unknown>>}) => {
            return buildWsContext(ctx.connectionParams);
        }
    },
    wsServer
);

const server = new ApolloServer<Context>({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
});

async function start() {
    await server.start();
    app.get("/health", (_req, res) => res.send("ok"));
    app.use(
        "/graphql",
        json(),
        expressMiddleware(server, {context: async ({req}: {req: Request}) => buildHttpContext({req})})
    );
    httpServer.listen(PORT, () => console.log(`HTTP/WS on ${PORT}`));
}

start().catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
});

// start with npx tsx app/api/server.ts