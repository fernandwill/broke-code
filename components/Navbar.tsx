import React from "react";
import Link from "next/link";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
    return <div className="flex items-center justify-between sm:px-12 px-2 md:px-24">
        <Link href="/" className="flex items-center justify-center h-20">
            <img src="/logo.png" alt="LeetClone" className="h-full" />
        </Link>
        <div className="flex-items-center">
            <button className="bg-[#FF7A00] text-white font-semibold py-2 px-4 rounded-full mr-4 border-2 border-transparent hover:text-[#FF7A00] hover:bg-white hover:border-2 hover:border-[#FF7A00]transition duration-500 ease-in-out">Sign in</button>
        </div>
    </div>;
}

export default Navbar;