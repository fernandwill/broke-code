"use client";
import React from "react";
import dynamic from "next/dynamic";
import ProblemDescription from "@/components/ProblemDescription";

type WorkspaceProps = {

}

const Split = dynamic(() => import("react-split"), {ssr: false});

const Workspace: React.FC<WorkspaceProps> = () => {
    return (
        <Split className="split">
            <ProblemDescription />
            <div>Code Editor Here</div>
        </Split>
    );
};

export default Workspace;