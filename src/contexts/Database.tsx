import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User } from "firebase/auth"

import { createContext, useContext, useEffect, useRef, useState } from "react"

import LoadingPage from "../pages/LoadingPage"

import {
    functions,
    auth,
    db,
    requestsRef
} from "../firebase"
import { doc, onSnapshot, orderBy, query } from "firebase/firestore"
import { httpsCallable } from "firebase/functions"

export type FetchStatus = "static" | "error" | "loading"

export type UserDocumentType = {
    id: string,
    bio: string,
    email: string,
    upvotedOn: string[],
}

export type RequestType = {
    id: string,
    title: string,
    content: string,
    upvotes: number,
}

export type SayHelloFunction = (name: string) => Promise<any>

export type RegisterFunction = (email: string, password: string) => Promise<unknown>
export type LoginFunction = (email: string, password: string) => Promise<unknown>
export type LogoutFunction = () => Promise<unknown>

export type GrabRequestsFunction = () => void
export type AddRequestFunction = (title: string) => Promise<unknown>
export type UpvoteRequestFunction = (id: string) => Promise<unknown>

export type DatabaseContextType = {

    sayHello: SayHelloFunction,

    currentUser: User | null,
    currentDocument?: UserDocumentType

    register: RegisterFunction
    login: LoginFunction
    logout: LogoutFunction

    requests: RequestType[],
    grabRequests: GrabRequestsFunction,
    loadingRequestsStatus: FetchStatus,
    addNewRequest: AddRequestFunction,
    upvoteRequest: UpvoteRequestFunction,
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

    const helloFunction = httpsCallable(functions, "sayHello")
    const sayHello: SayHelloFunction = async (name) => {
        return helloFunction({name})
    }

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentDocument, setCurrentDocument] = useState<UserDocumentType | undefined>();
    const [loadingDoc, setLoadingDoc] = useState(true);
    const userDocRef = useRef<Function>();

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            setLoading(true);
            if(user){
                setCurrentUser(user);
                if(userDocRef.current)
                    userDocRef.current();
                const userRef = doc(db, "users", user.uid)
                userDocRef.current = onSnapshot(userRef, (snapshot) => {
                    // @ts-expect-error
                    setCurrentDocument({...snapshot.data(), id: snapshot.id})
                    setLoadingDoc(false)
                }, (err) => {
                    console.error(err)
                })
            }else{
                setCurrentUser(null)
                setCurrentDocument(undefined)
                setLoadingDoc(false)
            }
            setLoading(false)
        }) 
        return () => {
            unsub();
            if(userDocRef.current instanceof Function)
            userDocRef.current();
        }
    }, [])

    const register: RegisterFunction = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
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
        if(!unsubRequests.current){
            const requestsQuery = query(requestsRef, orderBy("upvotes", "desc"))
            unsubRequests.current = onSnapshot(requestsQuery, (snapshot) => {
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
    }

    const addRequest = httpsCallable(functions, "addRequest")
    const addNewRequest: AddRequestFunction = (title) => {
        return addRequest({title})
    }

    const upvoteRequestFunction = httpsCallable(functions, "upvoteRequest")
    const upvoteRequest: UpvoteRequestFunction = (id) => {
        return upvoteRequestFunction({id});
    }

    const value: DatabaseContextType = {
        sayHello,
        currentUser,
        currentDocument,
        register,
        login,
        logout,
        requests,
        grabRequests,
        loadingRequestsStatus,
        addNewRequest,
        upvoteRequest,
    }

    return <DatabaseContext.Provider
        value={value}
    >
        {
            loading || loadingDoc
                ? <LoadingPage />
                : children instanceof Function
                    ? children()
                    : children
        }
    </DatabaseContext.Provider>
}

export default DatabaseProvider
