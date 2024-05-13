import { useMemo } from "react";
import { useIcons } from "../contexts/Icons"
import { mergeClasses } from "../utils/mergeClasses"

type ButtonProps = {
    className?: string, 
    children: string,
    disabled?: boolean,
    loading?: boolean,
    onClick?: () => void,
    role?: "submit" | "button" | "reset",
    type?: "primary",
}

const Button = ({
    className,
    children,
    disabled,
    loading,
    onClick,
    role,
    type,
}: ButtonProps) => {

    const {AiOutlineLoading3Quarters} = useIcons();

    const determineType = () => {
        const types = {primary: "rounded-sm shadow-primary text-black font-semibold text-lg bg-amber-500 hover:brightness-110 active:brightness-125",}
        if(typeof type == "undefined" || typeof types[type] == "undefined")
            return types.primary
        else return types[type];
    }

    const currentType = useMemo(() => {
        return determineType();
    }, [])


    return <button
        className={mergeClasses(
            className ?? "",
            "w-full h-[3rem] flex items-center justify-center gap-4 px-4 relative cursor-pointer",
            currentType,
        )}
        disabled={disabled}
        onClick={onClick}
        type={role}
    >
        <span>
            {children}
        </span>
        {
            loading 
                && <AiOutlineLoading3Quarters 
                    size={30}
                    className="text-black absolute right-3 animate-spin"
                />
        }
    </button> 
}

export default Button
