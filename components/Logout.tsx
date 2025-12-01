"use client";
import React from "react";
import {FiLogOut} from "react-icons/fi";
import {useRouter} from "next/navigation"

const Logout: React.FC = () => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/auth");
    }

    return (
    <button className="bg-[#FFFFFF1A] py-1.5 px-3 cursor-pointer rounded text-[#FF7A00]" onClick={handleLogout}><FiLogOut /></button>
    );
};

export default Logout;