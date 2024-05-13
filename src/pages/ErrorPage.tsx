import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const ErrorPage = () => {
    
    const navigate = useNavigate();

    const [seconds, setSeconds] = useState(500)
    // @ts-expect-error: goofy ahh type error
    const interval = useRef<Interval | number | undefined>(null)
    useEffect(() => {
        interval.current = setInterval(() => {
            setSeconds(previous => {
                if(previous - 1 <= 0)
                    navigate("/")
                return previous - 1;
            })
        }, 1000)
        return () => clearInterval(interval.current)
    }, [])

    return <main className="w-full min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center gap-4">
        <header className="flex gap-4 items-center">
            <h1 className="text-4xl font-semibold mb-4">
                There is a problem.
            </h1>
        </header>
        <p className="text-lg font-medium text-black">
            Something is wrong with the page you're looking at.
        </p>
        <p className="text-lg font-medium text-black">
            <Link to="/" className="text-sky-700">Go home</Link> or move there in {seconds}
        </p>
    </main>
}

export default ErrorPage
