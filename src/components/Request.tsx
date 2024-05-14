import { useDatabase, type RequestType } from "../contexts/Database";
import type { MouseEvent } from "react";

import { useState } from "react"
import { useIcons } from "../contexts/Icons";
import { useUpvote } from "../contexts/Upvote";

import { mergeClasses } from "../utils/mergeClasses";

type RequestProps = RequestType
const Request = ({
    id,
    title,
    content,
    upvotes,
}: RequestProps) => {

    const {setError} = useUpvote();
    const { currentUser, currentDocument, upvoteRequest } = useDatabase();
    const { MdOutlineArrowDropDown, AiOutlineLoading3Quarters, FaArrowUp, FaPlus } = useIcons();

    const [display, setDisplay] = useState(false)
    const switchDisplay = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
        // @ts-expect-error
        if (e.target.getAttribute("id") != "upvote")
            setDisplay(previous => !previous)
    }

    const [loading, setLoading] = useState(false)
    const handleUpvote = async () => {
        if (!currentUser || !currentDocument)
            return
        if (!currentDocument.upvotedOn.includes(id))
            try {
                setLoading(true)
                await upvoteRequest(id);
            } catch (err) {
                setError(`Failed to upvote request.`)
                console.error(err);
            }
        setLoading(false)
    }

    const allowUpvote =
        !currentDocument?.upvotedOn?.includes(id)
            ? true
            : false;


    return <>
        <div className="w-full">
            <header
                className="w-full h-20 bg-white flex px-8 py-1 items-center justify-between cursor-pointer shadow-md border-[1px] border-slate-300"
                onClick={switchDisplay}
            >
                <h1 className="w-full text-2xl font-semibold text-black">
                    {title}
                </h1>
                <div className="flex gap-4 items-center">
                    <MdOutlineArrowDropDown
                        color="black"
                        size={40}
                    />
                    <div className="flex items-center gap-4 select-none">
                        <span className={mergeClasses(
                            "text-2xl text-cursor",
                            !allowUpvote ? "text-green-700 font-bold" : "text-black font-semibold"
                        )}
                        >
                            {upvotes}
                        </span>
                        {
                            currentUser
                                &&  <button
                                    className={mergeClasses(
                                        "grid place-items-center aspect-square h-10",
                                        !allowUpvote || loading ? "" : "cursor-pointer hover:bg-amber-500 rounded-full"
                                    )}
                                    onClick={handleUpvote}
                                    disabled={loading}
                                    id="upvote"
                                >
                                    {
                                        !loading
                                            ? allowUpvote
                                                ? <FaArrowUp
                                                    size={20}
                                                    className="text-black"
                                                    id="upvote"
                                                />
                                                : <FaPlus
                                                    size={20}
                                                    className='text-green-700'
                                                />
                                            : <AiOutlineLoading3Quarters
                                                size={20}
                                                className="animate-spin text-black"
                                            />
                                    }
                                </button>
                        }
                    </div>
                </div>
            </header>
            {
                display
                && <p className="block w-full p-8 text-lg bg-white shadow-md">
                    {content}
                </p>
            }
        </div>
    </>

}

export default Request
