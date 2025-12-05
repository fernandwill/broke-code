import React, {useState} from "react";
import {AuthView} from "@/store/useAuthModal";
import {graphqlRequest} from "@/app/lib/graphqlClient";
import {toast} from "react-toastify";

type SignupProps = {
    onChangeView: (view: AuthView) => void;
}

const createUser = `mutation CreateUser($email: String!, $name: String!, $password: String!) {
createUser(email: $email, name: $name, password: $password) {
    id
    email
    name
    }
}
`;

const Signup: React.FC<SignupProps> = ({onChangeView}) => {
    const [inputs, setInputs] = useState({email: "", displayName: "", password: "", confirmPassword: ""}); 

    const [isLoading, setIsLoading] = useState(false);

    const handleChangeInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleRegister = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputs.email || !inputs.displayName || !inputs.password || !inputs.confirmPassword) {
            toast.warn("All fields are required.", {position: "top-center", autoClose: 3000, theme: "dark"});
            return;
        }

        if (inputs.password !== inputs.confirmPassword) {
            toast.error("Passwords do not match.", {position: "top-center", autoClose: 3000, theme: "dark"});
            return;
        }

        if (inputs.password.length < 6) {
            toast.warn("Password must be at least 6 characters long.", {position: "top-center", autoClose: 3000, theme: "dark"});
            return;
        }

        setIsLoading(true);

        try {
            const {data, errors} = await graphqlRequest<{createUser: {id: string}}>(createUser, {
                email: inputs.email, name: inputs.displayName, password: inputs.password
            });
            if (errors?.length) throw new Error(errors[0].message);
            if (!data?.createUser) throw new Error("No user returned.");
            onChangeView("login");
        } catch (error: any) {
            toast.error(error.message ?? "Registration failed.", {position: "top-center", autoClose: 3000, theme: "dark"});
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-6 px-6 py-4" onSubmit={handleRegister}>
        <h3 className="text-xl font-medium text-white">Sign-up to LeetClone</h3>
        <div>
            <label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">Your Email</label>
            <input type="email" name="email" id="email" className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" placeholder="your@email.com" onChange={handleChangeInput}></input>
        </div>
         <div>
            <label htmlFor="displayName" className="text-sm font-medium block mb-2 text-gray-300">Your Display Name</label>
            <input type="displayName" name="displayName" id="displayName" className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" placeholder="John Doe" onChange={handleChangeInput}></input>
        </div>
        <div>
            <label htmlFor="password" className="text-sm font-medium block mb-2 text-gray-300">Your Password</label>
            <input type="password" name="password" id="password" className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" placeholder="************" onChange={handleChangeInput}></input>
        </div>
         <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium block mb-2 text-gray-300">Confirm Your Password</label>
            <input type="confirmPassword" name="confirmPassword" id="confirmPassword" className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" placeholder="************" onChange={handleChangeInput}></input>
        </div>
        <button type="submit" className="w-full text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#FF7A00] hover:bg-[#E86A00] transition duration-500 ease-in-out disabled:opacity-50" disabled={isLoading}>{isLoading ? "Registering..." : "Register"}</button>
        <div className="text-sm font-medium text-gray-500">Already have an account? {" "}
            <a href="#" className="text-blue-700 hover:underline" onClick={() => onChangeView("login")}>Login</a>
        </div>
        
    </form>
    )
}

export default Signup;