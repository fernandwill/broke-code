import {notFound} from "next/navigation";
import Topbar from "@/components/Topbar";
import Workspace from "@/components/Workspace";
import { graphqlRequest } from "@/app/lib/graphqlClient";
import type {DBProblem, Problem} from "@/app/utils/types/problem";
import {problems as localProblems} from "@/app/utils/problems";

const problemQuery = `
    query Problem($id: ID!) {
        problem(id: $id) {
            id
            title
            category
            difficulty
            likes
            dislikes
            order
            videoId
            link
        }
    }    
`;

async function loadProblem(id: string): Promise<Problem> {
    const {data, errors} = await graphqlRequest<{problem: DBProblem | null}>(problemQuery, {id});
    if (errors?.length) throw new Error(errors[0].message);
    if (!data?.problem) notFound();

    const local = localProblems[id];
    if (!local) notFound();

    const {handlerFunction, ...serializableLocal} = local;
    return {
        ...serializableLocal,
        title: data.problem.title,
        difficulty: data.problem.difficulty,
        category: data.problem.category,
        likes: data.problem.likes,
        dislikes: data.problem.dislikes,
        videoId: data.problem.videoId ?? undefined,
        link: data.problem.link ?? undefined,
        handlerFunction: typeof handlerFunction === "function" ? handlerFunction.toString() : handlerFunction,
    };
}

export default async function Page({params}: {params: {id: string}}) {
    const {id} = params;
    const problem = await loadProblem(id);

    return (
        <div>
            <Topbar problemPage />
            <Workspace problem={problem} />
        </div>
    );
}
