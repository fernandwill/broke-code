import "dotenv/config";
import http from "http";
import cors from "cors";
import express, { Request } from "express";
import { json } from "body-parser";
import { ApolloServer } from "@apollo/server";
import { WebSocketServer } from "ws";
import { expressMiddleware } from "@as-integrations/express4";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { useServer } from "graphql-ws/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";

// Import your types and helpers
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import {
    Context,
    buildHttpContext,
    buildWsContext
} from "./context";

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
        // REFACTORED: Use the shared helper from context.tsx
        context: async (ctx) => {
            return buildWsContext(ctx.connectionParams);
        }
    },
    wsServer
);

// Setup Apollo Server
// REFACTORED: Pass the strict 'Context' type here
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

await server.start();

app.get("/health", (_req, res) => res.send("ok"));

app.use(
    "/graphql",
    json(),
    expressMiddleware(server, {
        // REFACTORED: Use the shared helper from context.tsx
        context: async ({ req }: { req: Request }) => {
            return buildHttpContext({ req });
        }
    })
);

httpServer.listen(PORT, () => console.log(`HTTP/WS on ${PORT}`));