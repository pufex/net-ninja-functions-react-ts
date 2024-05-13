type LinkNavProps = {
    children: string | JSX.Element | JSX.Element[] | (() => JSX.Element)
    onClick?: () => void,
    disabled?: boolean, 
}

const NavButton = ({
    children,
    onClick,
    disabled,
}: LinkNavProps) => {
    return <button
        onClick={onClick}
        disabled={Boolean(disabled)}
        className="transform text-black flex items-center gap-2 text-xl py-1 px-1 border-b-4 border-amber-500 font-medium hover:bg-amber-500"
    >
        {
            children instanceof Function
                ? children()
                : children
        }
    </button>
}

export default NavButton
