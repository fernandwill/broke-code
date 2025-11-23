import React from "react";
import {AuthView} from "@/store/useAuthModal";

type SignupProps = {
    onChangeView: (view: AuthView) => void;
}

const Signup: React.FC<SignupProps> = ({onChangeView}) => {
    return (
        <form className="space-y-6 px-6 py-4">
        <h3 className="text-xl font-medium text-white">Sign-up to LeetClone</h3>
        <div>
            <label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">Your Email</label>
            <input type="email" name="email" id="email" className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" placeholder="your@email.com"></input>
        </div>
         <div>
            <label htmlFor="displayName" className="text-sm font-medium block mb-2 text-gray-300">Your Display Name</label>
            <input type="displayName" name="displayName" id="displayName" className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" placeholder="John Doe"></input>
        </div>
        <div>
            <label htmlFor="password" className="text-sm font-medium block mb-2 text-gray-300">Your Password</label>
            <input type="password" name="password" id="password" className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" placeholder="************"></input>
        </div>
         <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium block mb-2 text-gray-300">Confirm Your Password</label>
            <input type="confirmPassword" name="confirmPassword" id="confirmPassword" className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" placeholder="************"></input>
        </div>
        <button type="submit" className="w-full text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#FF7A00] hover:bg-[#E86A00] transition duration-500 ease-in-out">Register</button>
        <div className="text-sm font-medium text-gray-500">Already have an account? {" "}
            <a href="#" className="text-blue-700 hover:underline" onClick={() => onChangeView("login")}>Login</a>
        </div>
        
    </form>
    )
}

export default Signup;