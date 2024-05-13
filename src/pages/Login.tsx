import type { FormEvent } from "react"

import { useState } from "react"
import { useInput } from "../hooks/useInput/hooks/useInput/useInput"
import { useDatabase } from "../contexts/Database"
import { useNavigate } from "react-router-dom"

import Input from "../components/Input"
import Button from "../components/Button"

import { validateEmail } from "../utils/validations"

const Register = () => {
    
    const navigate = useNavigate();

    const {currentUser, login} = useDatabase();

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [email, handleEmailChange, setEmailError] = useInput({})
    const [password, handlePasswordChange, setPasswordError] = useInput({})
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("")
        setEmailError()
        setPasswordError()

        let shouldReturn = false;

        if(!email.value.length){
            shouldReturn = true;
            setEmailError(true, "Can't be empty")
        }
        else if(validateEmail(email.value)){
            shouldReturn = true;
            setEmailError(true, "Invalid Email")
        }

        if(password.value.length < 6){
            shouldReturn = true;
            setPasswordError(true, "Min. 6 characters")
        }

        if(shouldReturn) return;

        try{
          setLoading(true)
          await login(email.value, password.value)
        }catch(error){
          console.error(error)
          setError("Failed to register.")
        }
        setLoading(false)

    }

    if(currentUser) navigate("/")

    return <main className="w-full min-h-[100vh] grid place-items-center">
        <section className="w-full px-8 py-12 max-w-[400px] rounded-xl shadow-lg flex flex-col border-[1px] border-gray-300 bg-white">
            <h1 className="w-full text-center text-4xl font-semibold text-black mb-4">
                Log In
            </h1>
            <form 
                className="w-full flex flex-col gap-2"
                onSubmit={handleSubmit}
            >
                {
                    error 
                        && <h1 className="w-full text-xl font-semibold text-red-500 text-center">
                            {error}
                        </h1>
                }
                <Input
                    placeholder="Your Email Address"
                    value={email.value}
                    isError={email.isError}
                    errorMessage={email.errorMessage}
                    onChange={handleEmailChange}
                    className="mt-4"
                />
                <Input
                    placeholder="Your Password"
                    value={password.value}
                    isError={password.isError}
                    errorMessage={password.errorMessage}
                    onChange={handlePasswordChange}
                    isPassword
                />
                <Button
                    loading={loading}
                    disabled={loading}
                    className="mt-6"
                >
                    Log In
                </Button>
            </form>
        </section>
    </main>
  
}

export default Register
