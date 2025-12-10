"use client";
import React, {useState, useEffect} from "react";
import {BsCheckCircle} from "react-icons/bs";
import Link from "next/link";
import {AiFillYoutube} from "react-icons/ai";
import {IoClose} from "react-icons/io5";
import YouTube from "react-youtube";
import {graphqlRequest} from "@/app/lib/graphqlClient";
import {ProblemUserState} from "@/app/utils/types/problem";

type ProblemRow = {
    id: string;
    title: string;
    difficulty: string;
    category: string;
    order: number
    videoId?: string | null;
    userState?: ProblemUserState;
}

const problemQuery = `
    query Problems {
        problems {
            id
            title
            difficulty
            category
            order
            videoId
            userState {solved attempted bookmarked liked}
        }
    }
`;

type ProblemTableProps = {

};

const ProblemTable: React.FC<ProblemTableProps> = () => {
    const [problems, setProblems] = useState<ProblemRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [ytPlayer, setYTPlayer] = useState({
        isOpen: false,
        videoId: ""
    })

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                const {data, errors} = await graphqlRequest<{problems: ProblemRow[]}>(problemQuery, undefined, token ? {token} : undefined);
                if (errors?.length) throw new Error(errors[0].message);
                if (!cancelled) {
                    setProblems((data?.problems ?? []).slice().sort((a, b) => a.order - b.order));
                    setError(null);
                }
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load problems.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const closeModal = () => {
        setYTPlayer({isOpen: false, videoId: ""});
    }

    if (loading) return <tbody><tr><td className="px-6 py-4 text-white">Loading...</td></tr></tbody>
    if (error) return <tbody><tr><td className="px-6 py-4 text-red-400">Error: {error}</td></tr></tbody>

    return (
        <>
        <tbody className="text-white">
            {problems.map((doc, idx) => {
                const diffColor = doc.difficulty === "Easy" ? "text-[#2CBB5D]" : doc.difficulty === "Medium" ? "text-[#FFC01E]" : "text-[#FF375F]";
                const solved = doc.userState?.solved;
                const statusColor = solved ? "text-[#2CBB5D]" : "text-gray-500";

                return (
                    <tr className={`${idx % 2 == 1 ? "bg-[#282828]" : ""}`} key={doc.id}>
                    <th className="px-2 py-4 font-medium whitespace-nowrap text-[#2CBB5D]">
                        <BsCheckCircle fontSize={"18"} width="18" className={statusColor}/>
                    </th>
                        <td className="px-6 py-4">
                        <Link className="hover:text-blue-600 cursor-pointer" href={`/problems/${doc.id}`}>{doc.title}</Link>
                        </td>
                        <td className={`px-6 py-4 ${diffColor}`}>{doc.difficulty}</td>
                        <td className={"px-6 py-4"}>{doc.category}</td>
                        <td className={"px-6 py-4"}>
                            {doc.videoId ? (
                            <AiFillYoutube fontSize={"28"} className="cursor-pointer hover:text-red-600" onClick={() => setYTPlayer({isOpen: true, videoId: doc.videoId as string})}/>
                        ) : (
                            <p className="text-gray-400">Coming Soon...</p>
                        )}
                    </td>
                </tr>
                );
            })}
        </tbody>
        {ytPlayer.isOpen && (
        <tfoot className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center">
                <div className="bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute" onClick={closeModal}></div>
                <div className="w-full z-50 h-full px-6 relative max-w-4xl">
                    <div className="w-full h-full flex items-center justify-center relative">
                        <div className="w-full relative">
                            <IoClose fontSize={"35"} className="cursor-pointer absolute -top-16 right-0" onClick={closeModal}/>
                            <YouTube videoId={ytPlayer.videoId} loading="lazy" iframeClassName="w-full min-h-[500px]" />
                        </div>
                    </div>
                </div>
            </tfoot>
            )}
        </>
    );
};

export default ProblemTable;