import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User } from "firebase/auth"

import { createContext, useContext, useEffect, useRef, useState } from "react"

import LoadingPage from "../pages/LoadingPage"

import {
    auth,
    db,
    requestsRef
} from "../firebase"
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore"

export type FetchStatus = "static" | "error" | "loading"

export type UserDocumentType = {
    id: string,
    bio: string,
    email: string,
}

export type RequestType = {
    id: string,
    title: string,
    content: string,
}

export type RegisterFunction = (email: string, password: string) => Promise<unknown>
export type LoginFunction = (email: string, password: string) => Promise<unknown>
export type LogoutFunction = () => Promise<unknown>

export type GrabRequestsFunction = () => void

export type DatabaseContextType = {
    currentUser: User | null,
    currentDocument?: UserDocumentType

    register: RegisterFunction
    login: LoginFunction
    logout: LogoutFunction

    requests: RequestType[],
    grabRequests: GrabRequestsFunction,
    loadingRequestsStatus: FetchStatus,

}

const DatabaseContext = createContext<DatabaseContextType | null>(null)

export const useDatabase = () => {
    const database = useContext(DatabaseContext);
    if(!database) throw Error("Cannot use outside a provider.")
    else return database;
}

type DatabaseProviderProps = {
    children: string | JSX.Element | JSX.Element[] | (() => JSX.Element)
}

const DatabaseProvider = ({
    children
}:DatabaseProviderProps) => {

    const [loading, setLoading] = useState(true);

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentDocument, setCurrentDocument] = useState<UserDocumentType | undefined>();

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            setLoading(true);
            if(user){
                setCurrentUser(user);
                const userRef = doc(db, "users", user.uid)
                getDoc(userRef)
                    .then((snapshot) => {
                        // @ts-expect-error
                        setCurrentDocument({...snapshot.data(), id: snapshot.id})
                    })
                    .catch((error) => {
                        console.error(error)
                        setCurrentUser(null);
                    })
            }
            setLoading(false)
        }) 
        return unsub
    }, [])

    const register: RegisterFunction = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((user) => {
                const userRef = doc(db, "users", user.user.uid)
                setDoc(userRef, {
                    email,
                    bio: "",
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const login: LoginFunction = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout: LogoutFunction = () => {
        return signOut(auth);
    }

    const [requests, setRequests] = useState<RequestType[]>([])
    const [loadingRequestsStatus, setLoadingRequests] = useState<FetchStatus>("loading")
    const unsubRequests = useRef<Function>()

    const grabRequests = () => {
        if(!unsubRequests.current)
            unsubRequests.current = onSnapshot(requestsRef, (snapshot) => {
                setLoadingRequests("loading")
                const requestArr: RequestType[] = [];
                snapshot.docs.forEach((doc) => {
                    // @ts-expect-error
                    requestArr.push({...doc.data(), id: doc.id})
                })
                setRequests(requestArr)
                setLoadingRequests("static")
            }, (err) => {
                console.error(err)
                setLoadingRequests("error");
            })
    }

    const value: DatabaseContextType = {
        currentUser,
        currentDocument,
        register,
        login,
        logout,
        requests,
        grabRequests,
        loadingRequestsStatus
    }

    return <DatabaseContext.Provider
        value={value}
    >
        {
            !loading 
                ? children instanceof Function
                    ? children()
                    : children
                : <LoadingPage />
        }
    </DatabaseContext.Provider>
}

export default DatabaseProvider
