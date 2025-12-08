"use client";
import React from "react";
import dynamic from "next/dynamic";
import ProblemDescription from "@/components/ProblemDescription";
import PreferenceNav from "@/components/PreferenceNav";
import CodeEditor from "@/components/CodeEditor";

type WorkspaceProps = {

}

const Split = dynamic(() => import("react-split"), { ssr: false });

const Workspace: React.FC<WorkspaceProps> = () => {
    return (
        <Split className="split h-[calc(100vh-50px)]" direction="horizontal" gutterSize={8} minSize={0} gutter={(index, dir) => { const element = document.createElement("div"); element.className = `gutter gutter-${dir}`; return element; }}>
            <ProblemDescription />
            <div className="flex flex-col h-full">
                <PreferenceNav />
                <Split className="split-vertical flex-1" direction="vertical" gutterSize={8} minSize={0} gutter={(index, dir) => { const element = document.createElement("div"); element.className = `gutter gutter-${dir}`; return element; }}>
                    <div className="bg-[#1E1E1E] h-full overflow-auto">
                        <CodeEditor />
                    </div>
                    <div>Test Cases Here</div>
                </Split>
            </div>
        </Split>
    );
};

export default Workspace;