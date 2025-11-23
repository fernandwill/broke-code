"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/modals/AuthModal";
import {useAuthModal} from "@/store/useAuthModal";

type AuthPageProps = {

};

const AuthPage:React.FC<AuthPageProps> = () => {
    const {isOpen, open, close, view, setView} = useAuthModal();

    return <div className="relative min-h-screen bg-gradient-to-b from-gray-600 to-black">
        <div className="max-w-7xl mx-auto">
            <Navbar />
            <div className="flex items-center justify-center h-[calc(100vh-5rem)] pointer-event-none select-none">
                <img src="/hero.png" alt="Hero.img" />
            </div>
            {isOpen && (<AuthModal view={view} onClose={close} onChangeView={setView} />)}
        </div>
    </div>
}

export default AuthPage;