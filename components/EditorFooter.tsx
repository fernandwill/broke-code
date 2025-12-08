import React from "react";
import {BsChevronUp} from "react-icons/bs";

type EditorFooterProps = {

}

const EditorFooter: React.FC<EditorFooterProps> = () => {
    return (
        <div className="flex bg-[#282828] absolute bottom-0 z-10 w-full">
	        <div className="mx-5 my-[10px] flex justify-between w-full">
		        <div className="mr-2 flex flex-1 flex-nowrap items-center space-x-4">
			    <button className="px-3 py-1.5 font-medium items-center transition-all inline-flex bg-[#FFFFFF24] text-sm hover:bg-[#FFFFFF1A] text-[#EFF1F6BF] rounded-lg pl-3 pr-2">
				    Console
				    <div className="ml-1 transform transition flex items-center">
					    <BsChevronUp className="fill-gray-6 mx-1 fill-[#8A8A8A]" />
				    </div>
			    </button>
		    </div>
		        <div className="ml-auto flex items-center space-x-4">
			        <button className="px-3 py-1.5 text-sm font-medium items-center whitespace-nowrap transition-all focus:outline-none inline-flex bg-[#FFFFFF1A] hover:bg-[#FFFFFF24] text-[#EFF1F6BF] rounded-lg">
				    Run
			        </button>
			        <button className="px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-white bg-[#2CBB5D] hover:bg-green-3 rounded-lg">
				    Submit
			        </button>
		        </div>
	        </div>
        </div>
    )
}

export default EditorFooter;