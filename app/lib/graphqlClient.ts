type GraphQLError = {message: string};
type GraphQLResponse<T> = {data?: T; errors?: GraphQLError[]};

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || process.env.GRAPHQL_URL || "http://localhost:4000/graphql";

export async function graphqlRequest<T> (
    query: string,
    variables?: Record<string, unknown>,
    opts?: {token?: string}
) : Promise<GraphQLResponse<T>> {
    
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(opts?.token ? {Authorization: `Bearer ${opts.token}`} : {})
        },
        body: JSON.stringify({query, variables})
    });
    const json = (await response.json()) as GraphQLResponse<T>;
    return json;
}