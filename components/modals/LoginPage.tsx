"use client";
import React, { useState, useEffect } from "react";
import { AuthView } from "@/store/useAuthModal";
import { graphqlRequest } from "@/app/lib/graphqlClient";
import {toast} from "react-toastify";

type LoginPageProps = {
    onChangeView: (view: AuthView) => void;
    onClose: () => void;
};

type UserLoginResponse = {
    userLogin: { jwtToken: string; user: { id: string; email: string; name?: string | null } };
};

const userLogin = `mutation UserLogin($email: String!, $password: String!) {
    userLogin(email: $email, password: $password) {
    jwtToken
    user {
        id
        email
        name
    }
  }
}`;

const LoginPage: React.FC<LoginPageProps> = ({ onChangeView, onClose }) => {
    const [inputs, setInputs] = useState({ email: "", password: "" });

    const [isLoading, setIsLoading] = useState(false);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => setInputs((prev) => ({
        ...prev, [e.target.name]: e.target.value
    }));

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputs.email || !inputs.password) { toast.error("All fields are required."); return; }

        setIsLoading(true);

        try {
            const { data, errors } = await graphqlRequest<UserLoginResponse>(userLogin, { email: inputs.email, password: inputs.password });

            if (errors?.length) throw new Error(errors[0].message);
            if (!data?.userLogin) throw new Error("No data returned.");

            localStorage.setItem("token", data.userLogin.jwtToken);
            window.dispatchEvent(new Event("auth-token-changed"));
            toast.success("Signed in successfully.");
            onClose();
        } catch (err: unknown) {

            const errMessage = err instanceof Error ? err.message : "Login failed.";
            toast.error(errMessage, {position: "top-center", autoClose: 3000, theme: "dark"});;
        } finally {
            setIsLoading(false);
        }
    };

    return <form className="space-y-6 px-6 py-4" onSubmit={handleLogin}>
        <h3 className="text-xl font-medium text-white">Sign In to LeetClone</h3>
        <div>
            <label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">Your Email</label>
            <input type="email" name="email" id="email" className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" placeholder="your@email.com" onChange={handleChangeInput} value={inputs.email}></input>
        </div>
        <div>
            <label htmlFor="password" className="text-sm font-medium block mb-2 text-gray-300">Your Password</label>
            <input type="password" name="password" id="password" className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" placeholder="************" onChange={handleChangeInput} value={inputs.password}></input>
        </div>
        <button type="submit" className="w-full text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#FF7A00] hover:bg-[#E86A00] transition duration-500 ease-in-out" disabled={isLoading}>{isLoading ? "Signing in..." : "Sign In"}</button>
        <button type="button" className="text-sm block text-[#FF7A00] hover:underline w-full text-right cursor-pointer" onClick={() => onChangeView("reset")}>Forgot Password</button>
        <div className="text-sm font-medium text-gray-500">Not Registered? {" "}
            <button type="button" className="text-blue-700 hover:underline cursor-pointer" onClick={() => onChangeView("signup")}>Create account</button>
        </div>
    </form>
}

export default LoginPage;
