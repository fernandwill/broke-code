import React from "react";
import {AiOutlineSetting, AiOutlineFullscreen} from "react-icons/ai";

type PreferenceNavProps = {

}



const PreferenceNav: React.FC<PreferenceNavProps> = () => {
    return (
    <div className="flex items-center justify-between bg-[#1A1A1A] h-11 w-full px-3">
        <div className="flex items-center text-white">
            <button className="flex cursor-pointer items-center rounded text-left focus:outline-none bg-[#FFFFFF1A] text-[#EFF1F6BF] hover:bg-[#FFFFFF24] px-2 py-1.5 font-medium">
                <div className="flex items-center px-1">
                    <div className="text-xs text-label-2 dark:text-[#eff1f6bf]">
                        JavaScript
                    </div>
                </div>
            </button>
        </div>

        <div className="flex items-center m-2">
            <button className="relative rounded px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex ml-auto p-1 mr-2 hover:bg-[#FFFFFF24] group">
                <div className="h-4 w-4 text-[#8A8A8A] font-bold text-lg">
                    <AiOutlineSetting />
                </div>
                <div className="absolute w-auto p-2 text-sm m-2 min-w-max translate-x-3 right-0 top-5 z-10 rounded-md shadow-md text-[#EFF1F6C0] bg-gray-600 origin-center scale-0 transition-all duration-100 ease-linear group-hover:scale-100">
                    Settings
                </div>
            </button>

            <button className="relative rounded px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex ml-auto p-1 mr-2 hover:bg-[#FFFFFF24] group">
                <div className="h-4 w-4 text-[#8A8A8A] font-bold text-lg">
                    <AiOutlineFullscreen />
                </div>
                <div className="absolute w-auto p-2 text-sm m-2 min-w-max translate-x-3 right-0 top-5 z-10 rounded-md shadow-md text-[#EFF1F6C0] bg-gray-600 origin-center scale-0 transition-all duration-100 ease-linear group-hover:scale-100">
                    Full Screen
                </div>
            </button>
        </div>
    </div>
    )
}

export default PreferenceNav;