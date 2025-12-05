"use client";
import React from "react";
import dynamic from "next/dynamic";
import ProblemDescription from "@/components/ProblemDescription";

type WorkspaceProps = {

}

const Split = dynamic(() => import("react-split"), { ssr: false });

const Workspace: React.FC<WorkspaceProps> = () => {
    return (
        <Split className="split h-[calc(100vh-50px)]" direction="horizontal" gutterSize={8} minSize={200} gutter={(index, dir) => { const element = document.createElement("div"); element.className = `gutter gutter-${dir}`; return element; }}>
            <ProblemDescription />
            <Split className="split-vertical flex flex-col" direction="vertical" gutterSize={8} minSize={150} gutter={(index, dir) => { const element = document.createElement("div"); element.className = `gutter gutter-${dir}`; return element; }}>
                <div>Code Editor Here</div>
                <div>Test Cases Here</div>
            </Split>
        </Split>
    );
};

export default Workspace;