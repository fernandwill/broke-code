"use client";
import React from "react";
import { useParams, notFound } from "next/navigation";
import Topbar from "@/components/Topbar";
import Workspace from "@/components/Workspace";
import { problems } from "@/app/utils/problems";

export default function Page() {
    const params = useParams();
    const id = params.id as string;
    const problem = problems[id];

    if (!problem) {
        notFound();
    }

    return (
        <div>
            <Topbar problemPage />
            <Workspace problem={problem} />
        </div>
    );
}