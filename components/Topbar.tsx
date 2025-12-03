"use client";
import React from "react";
import Link from "next/link";
import {useGraphqlAuth} from "@/app/lib/graphqlAuth";
import Logout from "@/components/Logout";
import {useAuthModal} from "@/store/useAuthModal";

type TopbarProps = {

};

const Topbar:React.FC<TopbarProps> = () => {
    const {user, loading, error} = useGraphqlAuth();
	const {open, setView} = useAuthModal();
	const handleClick = () => {setView("login"); open(); }; 

    return (
        <nav className="relative flex h-[50px] w-full shrink-0 items-center px-5 bg-[#282828] text-[#B3B3B3]">
			<div className={`flex w-full items-center justify-between max-w-[1200px] mx-auto`}>
				<Link href="/" className="h-[22px] flex-1">
					<img src="/logo-full.png" alt="Logo" className="h-full" />
				</Link>

				<div className="flex items-center space-x-4 flex-1 justify-end">
					<div>
						<a
							href="https://www.buymeacoffee.com/burakorkmezz"
							target="_blank"
							rel="noreferrer"
							className="bg-[#FFFFFF1A] py-1.5 px-3 cursor-pointer rounded text-[#FF7A00] hover:bg-[#FFFFFF24]"
						>
							Premium
						</a>
					</div>
                    {!user && (
						<button className="bg-[#FFFFFF1A] py-1 px-2 cursor-pointer rounded" onClick={handleClick}>Sign In</button>
                    )}
                    {user && (
                        <div className="cursor-pointer group relative">
                            <img src="/avatar.png" alt="user_profile_img" className="h-8 w-8 rounded-full" />
                            <div className="absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-[#282828] text-[#FF7A00] p-2 rounded shadow-lg z-40 group-hover:scale-100 scale-0 transition-all duration-300 ease-in-out"><p className="text-sm">{user.email}</p>
                            </div>
                        </div>
                    )}
                    {user && <Logout />}
				</div>
			</div>
        </nav>
    );
};

export default Topbar;