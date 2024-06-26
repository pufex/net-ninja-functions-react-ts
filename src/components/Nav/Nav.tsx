import { useEffect, useState } from "react"
import { useIcons } from "../../contexts/Icons";
import { useNavigate } from "react-router-dom";

import NavButton from "./components/NavButton";

import RequestModal from "../RequestModal";
import { useDatabase } from "../../contexts/Database";

const Nav = () => {

    const navigate = useNavigate()

    const {currentUser, logout} = useDatabase();

    const {AiOutlineLoading3Quarters} = useIcons();

    const [requestModal, setRequestModal] = useState(false);
    const switchRequestModal = () => {
        setRequestModal(previous => !previous)
    }

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
 
    useEffect(() => {
        console.error(error);
    }, [error])

    const handleLogout = async () => {
        try{
            setLoading(true)
            await logout();
        }catch(error){
            setError("Failed to logout.")
            console.error(error)
        }
        setLoading(false)
    }

    return <>
        {
            requestModal
                && <RequestModal closeModal={() => setRequestModal(false)}/>
        }
        <nav className="relative w-full h-24 flex items-center justify-end px-4 py-1 gap-5 border-b-[1px] border-slate-400 shadow-lg z-10 bg-white">
            {
                currentUser
                    ? <>
                        <NavButton
                            onClick={switchRequestModal}
                        >
                            add request
                        </NavButton>
                        <NavButton
                            onClick={handleLogout}
                            disabled={loading}
                        >
                            {
                                loading 
                                    ? <>
                                        sign out
                                        <AiOutlineLoading3Quarters
                                            className="text-black animate-spin"
                                            size={20}
                                        />
                                    </> 
                                    : "sign out"
                            }
                        </NavButton>
                    
                    </> 
                    : <>
                        <NavButton
                            onClick={() => navigate("/login")}
                        >
                            Log In
                        </NavButton>
                        <NavButton
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </NavButton>
                    </>
            }
        </nav>
    </>
}

export default Nav
