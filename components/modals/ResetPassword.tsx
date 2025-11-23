import React from "react";
import {AuthView} from "@/store/useAuthModal";

type ResetPasswordProps = {

}

const ResetPassword: React.FC<ResetPasswordProps> = ({}) => {
    return (
        <form className="space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8">
            <h3 className="text-xl font-medium text-white">Reset Password</h3>
            <p className="text-sm text-white">
                Forgotten your password? Enter your email address below, and we&apos;ll send you an email to reset it.
            </p>
            <div>
                <label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">Your Recovery Email</label>
                <input type="email" name="email" id="email" className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" placeholder="your@email.com" />
            </div>
            <button type="submit" className="w-full text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#FF7A00] hover:bg-[#E86A00] transition duration-500 ease-in-out">Reset Password</button>
        </form>
    )
}

export default ResetPassword;