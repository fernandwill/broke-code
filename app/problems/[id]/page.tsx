import React from "react";
import Topbar from "@/components/Topbar";
import Workspace from "@/components/Workspace"

type ProblemProps = {

};

const Problem:React.FC<ProblemProps> = () => {
    return (
    <div>
        <Topbar problemPage />
        <Workspace />
    </div>
    )
};

export default Problem;