import type { IconType } from "react-icons";

import { ReactElement, createContext, useContext } from "react"

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaLock } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export type IconsContextType = {
    AiOutlineLoading3Quarters: IconType,
    FaLock: IconType,
    FaUnlock: IconType,
    IoClose: IconType,
}

const IconsContext = createContext<IconsContextType | null>(null)

export const useIcons = () => {
    const icons = useContext(IconsContext);
    if(!icons) throw Error("Cannot use outside a provider.")
    else return icons;
}

type IconsProviderProps = {
    children: ReactElement[] | ReactElement,
}

const IconsProvider = ({
    children
}: IconsProviderProps) => {

    const value: IconsContextType = {
        AiOutlineLoading3Quarters,
        FaLock,
        FaUnlock,
        IoClose,
    }

    return <IconsContext.Provider
        value={value}
    >
        {children}
    </IconsContext.Provider> 
}

export default IconsProvider
