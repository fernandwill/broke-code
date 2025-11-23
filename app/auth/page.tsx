import React from "react";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/modals/AuthModal";

type AuthPageProps = {

};

const AuthPage:React.FC<AuthPageProps> = () => {
    return <div className="relative min-h-screen bg-gradient-to-b from-gray-600 to-black">
        <div className="max-w-7xl mx-auto">
            <Navbar />
            <div className="flex items-center justify-center h-[calc(100vh-5rem)] pointer-event-none select-none">
                <img src="/hero.png" alt="Hero.img" />
            </div>
            <AuthModal />
        </div>
    </div>
}

export default AuthPage;