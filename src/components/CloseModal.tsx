import { useIcons } from "../contexts/Icons"

type CloseModalProps = {
    onClick: () => void,
    top?: string,
    left?: string,
    right?: string,
    bottom?: string,
}

const CloseModal = ({
    top,
    right,
    bottom,
    left,
    onClick,
}: CloseModalProps) => {

    const {IoClose} = useIcons();

    return <button
        className="absolute h-[2rem] aspect-square"
        onClick={onClick}
        style={{
            left: left ?? "unset",
            top: top ?? "unset",
            bottom: bottom ?? "unset",
            right: right ?? "unset"
        }}
    >   
        <IoClose 
            size={40}
            className="absolute m-auto left-0 top-0 right-0 bottom-0 text-red-600"
        />
    </button>
}

export default CloseModal
