import type { IconType } from "react-icons";

import { ReactElement, createContext, useContext } from "react"

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaLock } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

export type IconsContextType = {
    AiOutlineLoading3Quarters: IconType,
    FaLock: IconType,
    FaUnlock: IconType,
    IoClose: IconType,
    MdOutlineArrowDropDown: IconType,
    FaArrowUp: IconType,
    FaPlus: IconType,
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
        MdOutlineArrowDropDown,
        FaArrowUp,
        FaPlus,
    }

    return <IconsContext.Provider
        value={value}
    >
        {children}
    </IconsContext.Provider> 
}

export default IconsProvider
