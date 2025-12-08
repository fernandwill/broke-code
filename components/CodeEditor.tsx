"use client";
import React from "react";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import dynamic from "next/dynamic";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false });

type CodeEditorProps = {

}

const CodeEditor: React.FC<CodeEditorProps> = () => {
    return (
        <div className="flex flex-col h-full bg-[#1E1E1E]">
                <div className="w-full overflow-auto h-full">
                    <CodeMirror
                        value="const a - 1;"
                        theme={vscodeDark}
                        extensions={[javascript()]}
                        style={{fontSize: 16}}
                    />
                </div>
        </div>
    )
}

export default CodeEditor;
