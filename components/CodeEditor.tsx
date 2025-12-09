"use client";
import React from "react";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import dynamic from "next/dynamic";
import {Problem} from "@/app/utils/types/problem";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false });

type CodeEditorProps = {
    problem: Problem;
}

const boilerPlate = `const twoSum = (nums, target) => {
    // Write your code here
}`;

const CodeEditor: React.FC<CodeEditorProps> = ({problem}) => {
    return (
        <div className="flex flex-col h-full bg-[#1E1E1E]">
                <div className="w-full overflow-auto h-full">
                    <CodeMirror
                        value={problem.starterCode}
                        theme={vscodeDark}
                        extensions={[javascript()]}
                        style={{fontSize: 16}}
                    />
                </div>
        </div>
    )
}

export default CodeEditor;
