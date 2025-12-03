"use client";
import {useState, useEffect} from "react";
import {graphqlRequest} from "./graphqlClient";

type MeResponse = {me: {id: string; email: string; name?: string | null} | null};

const meQuery = `query Me {
    me {
        id 
        email 
        name
    }
}`;

export function useGraphqlAuth() {
    const [user, setUser] = useState<MeResponse["me"]>(null);
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [token, setToken] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("token"): null));

    useEffect(() => {
        const handler = () => setToken(localStorage.getItem("token"));
        window.addEventListener("storage", handler);
        window.addEventListener("auth-token-changed", handler);
        return () => {
            window.removeEventListener("storage", handler);
            window.removeEventListener("auth-token-changed", handler);
        };
    }, []);

    useEffect(() => {
    let cancelled = false;

    if (!token) {
        setUser(null);
        setIsLoading(false);
        return () => {cancelled = true; };
    }

    setIsLoading(true);

    const fetchMe = async () => {
        try {
            const {data, errors} = await graphqlRequest<MeResponse>(meQuery, undefined, {token});
            if(errors?.length) throw new Error(errors[0].message);
            if (!cancelled) {
                setUser(data?.me ?? null);
                setError(null);
            }
        } catch (err: unknown) {
            const errMessage = err instanceof Error ? err.message : "Authentication failed.";
            if (!cancelled) {
                setUser(null);
                setError(new Error(errMessage));
            }
        } finally {
            if (!cancelled) setIsLoading(false);
        }
    };
        fetchMe();
        return () => {
            cancelled = true;
        };
    }, [token]);
    return {user, loading, error};
}
