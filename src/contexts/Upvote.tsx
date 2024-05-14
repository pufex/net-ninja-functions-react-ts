import {createContext, useContext, useState} from "react";

import Toast from "../components/Toast";

type setUpvoteError = (error?: string) => void
type UpvoteContexType = {
    upvoteError: string,
    setError: setUpvoteError,
}
const UpvoteContext = createContext<UpvoteContexType | null>(null)
export const useUpvote = () => {
    const upvote = useContext(UpvoteContext);
    if(!upvote) throw Error('Cannot useUpvote outside a provider.')
    else return upvote;
}

type UpvoteProviderType = {children: string | JSX.Element | JSX.Element[] | (() => JSX.Element)}
export const UpvoteProvider = ({children}:UpvoteProviderType) => {
    const [upvoteError, setUpvoteError] = useState("");
    const setError: setUpvoteError = (error) => setUpvoteError(error ?? "")
    const value: UpvoteContexType = {upvoteError, setError}
    return <UpvoteContext.Provider value={value}>
        {
            upvoteError 
            && <Toast
                type="danger"
                hideToast={() => setUpvoteError("")}
                fadeoutAfter={3000}
            >
                {upvoteError}
            </Toast>
        }
        {
            children instanceof Function
                ? children()
                : children
        }
    </UpvoteContext.Provider>
}
