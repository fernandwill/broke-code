import React from "react";
import {IoClose} from "react-icons/io5";
import LoginPage from "./LoginPage";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword";
import {AuthView} from "@/store/useAuthModal";

type AuthModalProps = {
    view: AuthView;
    onClose: () => void;
    onChangeView: (view:AuthView) => void;    
};

const AuthModal: React.FC<AuthModalProps> = ({view, onClose,onChangeView}) => {

    return (
        <>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/60" onClick={onClose}></div>
	        <div className="w-full sm:w-[450px]  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  flex justify-center items-center" onClick={onClose}>
		        <div className="relative w-full h-full mx-auto flex items-center justify-center">
			        <div className="bg-white rounded-lg shadow relative w-full bg-gradient-to-b from-[#FF7A00] to-slate-900 mx-6" onClick={(e) => e.stopPropagation()}>
				        <div className="flex justify-end p-2">
					        <button
						        type="button"
						        className="bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 hover:text-white text-white"
								onClick={onClose}
					        >
						    <IoClose className="h-5 w-5" />
					        </button>
				        </div>
                        {view === "login" ? <LoginPage onChangeView={onChangeView} /> : view === "signup" ? <Signup onChangeView={onChangeView} /> : <ResetPassword />}
			        </div>
		        </div>
	        </div>
        </>
    );
};

export default AuthModal;