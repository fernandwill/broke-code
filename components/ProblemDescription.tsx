"use client";
import {Problem, ProblemUserState} from "@/app/utils/types/problem";
import React, {useState, useEffect} from "react";
import {AiFillLike, AiFillDislike} from "react-icons/ai";
import {BsCheck2Circle} from "react-icons/bs";
import {TiStarOutline, TiStarFullOutline} from "react-icons/ti";
import {graphqlRequest} from "@/app/lib/graphqlClient";
import {useAuthModal} from "@/store/useAuthModal";
import {useGraphqlAuth} from "@/app/lib/graphqlAuth";
import {toast} from "react-toastify";

type ProblemDescriptionProps = {
problem: Problem
};

const userStateQuery = `
	query ProblemState($id: ID!) {
		problem(id: $id) {
			userState {solved attempted bookmarked liked disliked}
			}
		}
	`;

const setProblemStateMutation = `
	mutation SetProblemState($problemId: ID!, $input: ProblemStateInput!) {
		setProblemState(problemId: $problemId, input: $input) {
			solved
			attempted
			bookmarked
			liked
			disliked
			}
		}
	`;

const defaultState: ProblemUserState = {solved: false, attempted: false, bookmarked: false, liked: false, disliked: false};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({problem}) => {
	const {user} = useGraphqlAuth();
	const {open, setView} = useAuthModal();
	const [userState, setUserState] = useState<ProblemUserState>(problem.userState ?? defaultState);
	const [saving, setSaving] = useState(false);
	const [token, setToken] = useState<string | null>(null);
	const [count, setCount] = useState({likes: problem.likes ?? 0, dislikes: problem.dislikes ?? 0});

	useEffect(() => {
		const handler = () => setToken(typeof window !== "undefined" ? localStorage.getItem("token"): null);
		handler();
		window.addEventListener("auth-token-changed", handler);
		return () => window.removeEventListener("auth-token-changed", handler);
	}, []);

	useEffect(() => {
		setUserState(problem.userState ?? defaultState);
	}, [problem.id, problem.userState]);

	useEffect(() => {
		if (!user || !token) return;
		let cancelled = false;
		const loadState = async () => {
			const {data, errors} = await graphqlRequest<{problem: {userState: ProblemUserState | null}}>(userStateQuery, {id: problem.id}, {token});
			if (errors?.length || cancelled) return;
			if (data?.problem?.userState) setUserState(data.problem.userState);
		};
		loadState();
		return () => {
			cancelled = true;
		};
	}, [user, token, problem.id]);

	useEffect(() => {
		setCount({likes: problem.likes ?? 0, dislikes: problem.dislikes ?? 0});
	}, [problem.id, problem.likes, problem.dislikes]);

	const requireAuth = () => {
		setView("login");
		open();
	};

	const updateState = async (patch: Partial<ProblemUserState>) => {
		if (!user || !token) return requireAuth();
		setSaving(true);
		try {
			const prev = userState;
			const {data, errors} = await graphqlRequest<{setProblemState: ProblemUserState}>(setProblemStateMutation, {problemId: problem.id, input: patch}, {token});
			if (errors?.length) throw new Error(errors[0].message);
			if (data?.setProblemState) {
				setUserState(data.setProblemState);
				const likesDelta = (data.setProblemState.liked ? 1 : 0) - (prev.liked ? 1 : 0);
				const dislikesDelta = (data.setProblemState.disliked ? 1 : 0) - (prev.disliked ? 1 : 0);
				setCount((c) => ({likes: c.likes + likesDelta, dislikes: c.dislikes + dislikesDelta}));
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to update problem state.", {autoClose: 3000, theme: "dark"});
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="bg-[#282828]">
			{/* TAB */}
			<div className="flex h-11 w-full items-center pt-2 bg-[#1A1A1A] text-white overflow-x-hidden">
				<div className={"bg-[#282828] rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
					Description
				</div>
			</div>

			<div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
				<div className="px-5">
					{/* Problem heading */}
					<div className="w-full">
						<div className="flex space-x-4">
							<div className="flex-1 mr-2 text-lg text-white font-medium">{problem.title}</div>
						</div>
						<div className="flex items-center mt-3">
							<div
								className={"text-[#00B8A3] bg-[#00B8A3]/10 inline-block rounded-[21px] px-2.5 py-1 text-xs font-medium capitalize"}
							>
								{problem.difficulty}
							</div>
							<div className={`rounded p-[3px] ml-4 text-lg transition-colors duration-200 cursor-pointer ${userState.solved ? "text-[#2CBB5D]" : "text-[#8A8A8A]"}`} onClick={() => updateState({solved: !userState.solved, attempted: true})}>
								<BsCheck2Circle />
							</div>
							<div className={`flex items-center cursor-pointer hover:bg-[#FFFFFF1A] space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 ${userState.liked ? "text-[#2CBB5D]" : "text-[#8A8A8A]"}`} onClick={() => updateState({liked: !userState.liked, disliked: false})}>
								<AiFillLike />
								<span className="text-xs">{count.likes}</span>
							</div>
							<div className={`flex items-center cursor-pointer hover:bg-[#FFFFFF1A] space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 ${userState.disliked ? "text-[#FF375F]" : "text-[#8A8A8A]"}`} onClick={() => updateState({disliked: !userState.disliked, liked: false})}>
								<AiFillDislike />
								<span className="text-xs">{count.dislikes}</span>
							</div>
							<div className={`cursor-pointer hover:bg-[#FFFFFF1A]  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 ${userState.bookmarked ? "text-yellow-400" : "text-[#8A8A8A]"}`} onClick={() => updateState({bookmarked: !userState.bookmarked})}>
								{userState.bookmarked ? <TiStarFullOutline /> : <TiStarOutline />}
							</div>
						</div>

						{/* Problem Statement(paragraphs) */}
						<div className="text-white text-sm">
							<div dangerouslySetInnerHTML={{__html: problem.problemStatement}} />
						</div>

						{/* Examples */}
						<div className="mt-4">
							{problem.examples.map((example, index) => (
								<div key ={example.id}>
									<p className="font-medium text-white">Example {index + 1}: </p>
									{example.img && (
										<img src={example.img} alt="example-img" />
									)}
									<div className="example-card">
										<pre>
											<strong className="text-white">Input: </strong> {example.inputText}
											<br />
											<strong>Output: </strong> {example.outputText} <br />
											{example.explanation && (
												<>
												<strong>Explanation: </strong> {example.explanation}
												</>
											)}
										</pre>
									</div>
								</div>
							))}
						</div>

						{/* Constraints */}
						<div className="my-8 pb-4">
							<div className="text-white text-sm font-medium">Constraints:</div>
							<ul className="text-white ml-5 list-disc"> 
								<div dangerouslySetInnerHTML={{__html: problem.constraints}}/>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProblemDescription;
