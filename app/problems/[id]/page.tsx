import React from "react";
import Topbar from "@/components/Topbar";
import Workspace from "@/components/Workspace";
import {problems} from "@/app/utils/problems";
import {Problem} from "@/app/utils/types/problem";

type ProblemPageProps = {
    problem:Problem;
};

const ProblemPage:React.FC<ProblemPageProps> = ({problem}) => {
    return (
    <div>
        <Topbar problemPage />
        <Workspace problem={problem}/>
    </div>
    )
};

export default ProblemPage;