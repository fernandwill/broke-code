import React from "react";
import Navbar from "@/components/Navbar";

type AuthPageProps = {

};

const AuthPage:React.FC<AuthPageProps> = () => {
    return <div className="relative min-h-screen bg-gradient-to-b from-gray-600 to-black">
        <div className="max-w-7xl mx-auto">
            <Navbar />
        </div>
    </div>
}

export default AuthPage;