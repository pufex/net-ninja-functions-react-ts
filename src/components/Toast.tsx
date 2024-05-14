import { useEffect, useMemo, useRef, useState } from "react"
import { useIcons } from "../contexts/Icons"

import { mergeClasses } from "../utils/mergeClasses"

type ToastProps = {
    children: string,
    type?: "success" | "danger",
    hideToast: () => void,
    fadeoutAfter?: number
}

const Toast = ({
    children,
    type,
    hideToast,
    fadeoutAfter = 3000,
}: ToastProps) => {

    const {IoClose} = useIcons();

    const [step, setStep] = useState(1);
    // @ts-expect-error
    const timeout = useRef<Timeout | number | undefined>();
    const toastRef = useRef<HTMLDivElement>(null)
    const handleDisappearing = () => {
        hideToast();
    }

    useEffect(() => {
        if(step == 2)
            toastRef.current?.addEventListener("animationend", handleDisappearing)
    }, [step])

    useEffect(() => {
        if(timeout.current){
            setStep(1);
            clearTimeout(timeout.current)
            toastRef.current?.removeEventListener("animationend", handleDisappearing)
        }
        timeout.current = setTimeout(() => {
            setStep(2);
        }, fadeoutAfter)
        return () => {
            clearTimeout(timeout.current)
            toastRef.current?.removeEventListener("animationend", handleDisappearing)
        };
    }, [children])

    const determineType = (type: ToastProps["type"]) => {
        const types = {
            "success": "bg-green-500 text-white border-[1px] border-green-700 shadow-success",
            "danger": "bg-red-600 text-white border-[1px] border-red-700 shadow-danger",
        }
        if(!type)
            return types["success"]
        else if(typeof types == "undefined" || !types[type])
            return types["success"];
        else return types[type];
    }

    const typeStyles = useMemo(() => {
        return determineType(type)
    }, [type])

    return <>
        <div
            className={mergeClasses(
                "transform top-0 left-[50%] fixed w-[100vw] max-w-[200px] px-4 pt-5 pb-4 text-center rounded-md text-base font-medium z-50 select-none overflow-hidden",
                typeStyles,
                step == 1 ? "animate-slidein" : "animate-slideout"
            )}
            ref={toastRef}
        >
            <button
                className="absolute top-1 right-1 h-4 aspect-square"
                tabIndex={-1}
                onClick={handleDisappearing}
            >
                <IoClose
                    size={20}
                    className="text-white"
                />
            </button>
            <span>
                {children}
            </span>
            <div 
                className="absolute w-full bottom-0 left-0 h-[3px] bg-black/20 animation-shrinkX animation-duration"
                style={{
                    animationDuration: `${fadeoutAfter}ms`,
                }}
            ></div>
        </div>
    
    </>
}

export default Toast
