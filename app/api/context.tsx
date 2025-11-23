import jwt from "jsonwebtoken";
import { Request } from "express";

// 1. Define a strict User type (Single Source of Truth)
export type User = {
  sub: string;
  email?: string;
  // Add other JWT claims you expect here
  iat?: number;
  exp?: number;
};

// 2. Define the Context interface used by Resolvers
export interface Context {
  user?: User;
}

// 3. Helper: strictly verifies the token string
export const verifyToken = (token: string): User | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User;
    return decoded;
  } catch (error) {
    return null;
  }
};

// 4. HTTP Context Builder (for Express)
export const buildHttpContext = ({ req }: { req: Request }): Context => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return {};
  }
  
  const user = verifyToken(auth.slice(7));
  return user ? { user } : {};
};

// 5. WebSocket Context Builder (for graphql-ws)
export const buildWsContext = (connectionParams: Readonly<Record<string, unknown>> | undefined): Context => {
    // connectionParams keys can sometimes be lowercase/uppercase depending on the client
    const auth = (connectionParams?.authorization || connectionParams?.Authorization) as string | undefined;

    if (!auth || !auth.startsWith("Bearer ")) {
        return {};
    }

    const user = verifyToken(auth.slice(7));
    return user ? { user } : {};
}