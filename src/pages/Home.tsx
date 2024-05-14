import { useEffect } from "react";
import { useDatabase } from "../contexts/Database"
import { useIcons } from "../contexts/Icons";

import ErrorPage from "./ErrorPage";
import Request from "../components/Request";

import { UpvoteProvider } from "../contexts/Upvote";

const Home = () => {
    
    
    const { AiOutlineLoading3Quarters } = useIcons();
    const {requests, grabRequests, loadingRequestsStatus} = useDatabase();

    useEffect(() => {
        grabRequests()
    }, [])


    if(loadingRequestsStatus == "loading")
    return <main className="w-full min-h-[calc(100vh-6rem)] grid place-items-center">
        <AiOutlineLoading3Quarters
            size={30}
            className="text-black animate-spin"
        />
    </main>

    if(loadingRequestsStatus == "static")
    return <>
        <main
            className="w-full max-w-[1440px] mx-auto min-h-[calc(100vh - 6rem)] flex flex-col items-center p-8"
        >
            <header className="w-full flex flex-col items-center gap-4 mb-8">
                <h1 className="text-4xl font-semibold text-black">
                    Tutorial Requests
                </h1>
            </header>
            <section className="w-full flex flex-col gap-3 mt-4">
                <UpvoteProvider>
                    {
                        requests.length
                            ? requests
                                .map(({id, title, content, upvotes}) => {
                                    return <Request 
                                        id={id}
                                        title={title}
                                        content={content}
                                        upvotes={upvotes}
                                    />
                                })
                            : <h1 className="w-full text-xl">
                                No requests at the moment.
                            </h1>
                    }
                </UpvoteProvider>
            </section>
        </main>
    </>
    

    else
    return <ErrorPage />
}

export default Home
