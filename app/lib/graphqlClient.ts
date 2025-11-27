type GraphQLError = {message: string};
type GraphQLResponse<T> = {data?: T; errors?: GraphQLError[]};

export async function graphqlRequest<T> (
    query: string,
    variables?: Record<string, unknown>,
    opts?: {token?: string}
) : Promise<GraphQLResponse<T>> {
    
    const response = await fetch("http://localhost:4000/graphql", {
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