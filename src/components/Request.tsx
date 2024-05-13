import { useState } from "react"
import { useIcons } from "../contexts/Icons";

type RequestProps = {
    title: string,
    content: string,
}

const Request = ({
    title,
    content,
}: RequestProps) => {
    
    const {MdOutlineArrowDropDown} = useIcons();

    const [display, setDisplay] = useState(false)
    const switchDisplay = () => {
        setDisplay(previous => !previous)
    }

    return <div className="w-full">
        <header 
            className="w-full h-20 bg-white flex px-8 py-1 items-center justify-between cursor-pointer shadow-md border-[1px] border-slate-300"
            onClick={switchDisplay}
        >
            <h1 className="w-full text-2xl font-semibold text-black">
                {title}
            </h1>
            <MdOutlineArrowDropDown
                color="black"
                size={40}
            />
        </header>
        {
            display
                && <p className="block w-full p-8 text-lg bg-white shadow-md">
                    {content}
                </p>
        }
    </div>
}

export default Request
