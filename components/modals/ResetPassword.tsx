"use client";
import React, {useState} from "react";

type ResetPasswordProps = {

}

const ResetPassword: React.FC<ResetPasswordProps> = ({}) => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setMessage("");
        if (!email) {setError("Email is required."); return; }
        setIsLoading(true);

        try {
            const res = await fetch ("/api/reset-password", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email}),
            });
            if (!res.ok) throw new Error("Request failed.");
            setMessage("If the registered email exists, a reset link has been sent.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Request failed.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8" onSubmit={handleResetPassword}>
            <h3 className="text-xl font-medium text-white">Reset Password</h3>
            <p className="text-sm text-white">
                Forgotten your password? Enter your email address below, and we&apos;ll send you an email to reset it.
            </p>
            <div>
                <label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">Your Recovery Email</label>
                <input type="email" name="email" id="email" className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" placeholder="your@email.com" value={email} onChange={handleEmailChange}/>
            </div>
            <button type="submit" className="w-full text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#FF7A00] hover:bg-[#E86A00] transition duration-500 ease-in-out" disabled={isLoading}>{isLoading ? "Sending link..." : "Reset Password"}</button>
            {message && <p className="text-sm text-green-300">{message}</p>}
            {error && <p className="text-sm text-red-300">{error}</p>}
        </form>
    )
}

export default ResetPassword;