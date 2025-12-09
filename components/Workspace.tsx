"use client";
import React, {useState} from "react";
import dynamic from "next/dynamic";
import ProblemDescription from "@/components/ProblemDescription";
import PreferenceNav from "@/components/PreferenceNav";
import CodeEditor from "@/components/CodeEditor";
import EditorFooter from "@/components/EditorFooter";
import {Problem} from "@/app/utils/types/problem";

type WorkspaceProps = {
problem: Problem
};

const Split = dynamic(() => import("react-split"), { ssr: false });

const Workspace: React.FC<WorkspaceProps> = ({problem}) => {
    const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);

    return (
        <Split className="split h-[calc(100vh-50px)]" direction="horizontal" gutterSize={8} minSize={0} gutter={(index, dir) => { const element = document.createElement("div"); element.className = `gutter gutter-${dir}`; return element; }}>
            <ProblemDescription problem={problem}/>

            <div className="flex flex-col h-full relative overflow-x-hidden">
                <PreferenceNav />
                <Split className="split-vertical flex-1" direction="vertical" gutterSize={8} minSize={0} gutter={(index, dir) => { const element = document.createElement("div"); element.className = `gutter gutter-${dir}`; return element; }}>
                    <div className="bg-[#1E1E1E] h-full overflow-auto">
                        <CodeEditor problem={problem}/>
                    </div>

                    <div className="w-full px-5 overflow-auto bg-[#1E1E1E]">
                        <div className="flex h-10 items-center space-x-6">
                            <div className="relative flex h-full flex-col justify-center cursor-pointer">
                                <div className="text-sm font-medium leading-5 text-white">Testcases</div>
                                <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white" />
                            </div>
                        </div>

                        <div className="flex">
                            {problem.examples.map((example, index) => (
                            <div className="mr-2 items-start mt-2 text-white" key={example.id} onClick={() => setActiveTestCaseId(index)}>
                                <div className="flex flex-wrap items-center gap-y-4">
                                    <div className={`font-medium items-center transition-all focus:outline-none inline-flex bg-[#FFFFFF24] hover:bg-[#FFFFFF1A] relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
                                    ${activeTestCaseId === index ? "text-white" : "text-gray-500"}`}>
                                    Case {index + 1}
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>

                        <div className="font-semibold my-4">
                            <p className="text-sm font-medium mt-4 text-white">Input:</p>
                            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-[#FFFFFF24] border-transparent text-white mt-2">
                                {problem.examples[activeTestCaseId].inputText}
                            </div>
                            <p className="text-sm font-medium mt-4 text-white">Output:</p>
                            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-[#FFFFFF24] border-transparent text-white mt-2">
                                {problem.examples[activeTestCaseId].outputText}
                            </div>
                        </div>
                    </div>
                </Split>
                <EditorFooter />
            </div>
        </Split>
    );
};

export default Workspace;