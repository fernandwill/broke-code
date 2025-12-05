"use client";
import React from "react";
import {useRouter} from "next/navigation"
import {toast} from "react-toastify";

const Logout: React.FC = () => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("auth-token-changed"));
        router.push("/");
        toast.success("Signed out.", {autoClose: 3000, theme: "dark"})
    }

    return (
    <button className="bg-[#FFFFFF1A] py-1.5 px-3 cursor-pointer rounded text-[#FF7A00]" onClick={handleLogout}>Sign Out</button>
    );
};

export default Logout;