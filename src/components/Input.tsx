import type { ChangeEvent } from "react"

import { useRef, useState } from "react"
import { useIcons } from "../contexts/Icons"

import { mergeClasses } from "../utils/mergeClasses"

type InputProps = {
    className?: string,
    children?: string,
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    placeholder?: string,
    isPassword?: boolean,
    isError?: boolean,
    errorMessage?: string,
}

const Input = ({
    className,
    children,
    value,
    onChange,
    placeholder,
    isPassword,
    isError,
    errorMessage = "Invalid value",
}: InputProps) => {

    const {FaLock, FaUnlock} = useIcons()

    const [showPassword, setShowPassword] = useState(false)
    const switchPassword = () => {
        setShowPassword(previous => !previous)
    }

    const inputRef = useRef<HTMLInputElement>(null);
    const handleInputClick = () => {
        inputRef.current?.focus();
    }

    return <div 
        className={mergeClasses(
            "w-full flex flex-col gap-2",
            className ?? "",
        )}
    >
        {
            !children && !isError
                ? null 
                : <div className="w-full flex items-center justify-between">
                    {
                        children 
                            && <label className="text-lg font-normal text-black">
                                {children}
                            </label>
                    }
                    {
                        typeof isError != "undefined" && isError
                            && <label className="text-lg text-red-500 font-medium">
                                {errorMessage}
                            </label>
                    }
                </div>
        }
        <div 
            className="w-full h-[3rem] flex items-center justify-between px-4 rounded-sm border-gray-300 border-[2px] bg-white focus-within:border-amber-500"
            onClick={handleInputClick}
        >
            <input 
                ref={inputRef}
                type={
                    typeof isPassword == "undefined"
                        ? "text"
                        : showPassword  
                            ? "text"
                            : "password"
                }
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full bg-transparent outline-none border-none text-xl font-normal text-black"
            />
            {
                isPassword
                    && <div 
                        className="h-[2rem] aspect-square relative cursor-pointer"
                        onClick={switchPassword}
                    >
                        {
                            showPassword
                                ? <FaUnlock
                                    size={25}
                                    className="absolute top-0 left-0 right-0 bottom-0 m-auto"
                                />
                                : <FaLock
                                    size={25}
                                    className="absolute top-0 left-0 right-0 bottom-0 m-auto"
                                />
                        }
                    </div>
            }
        </div>    
    </div>
    
}

export default Input
