import { useIcons } from "../contexts/Icons"

const LoadingPage = () => {
    
    const {AiOutlineLoading3Quarters} = useIcons()

    return <main className="w-full min-h-[calc(100vh - 6rem)] grid place-items-center">
        <AiOutlineLoading3Quarters
            size={40}
            className="absolute top-0 left-0 right-0 bottom-0 m-auto animate-spin"
        />
    </main>
}

export default LoadingPage
