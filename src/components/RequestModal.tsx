import type { FormEvent } from "react";
import { useState, useEffect } from "react";
import { useInput } from "../hooks/useInput/hooks/useInput/useInput"

import Input from "./Input";
import Button from "./Button";
import CloseModal from "./CloseModal";

type RequestModalProps = {
  closeModal: () => void,
  modalState?: boolean,
}

const RequestModal = ({
  closeModal,
}: RequestModalProps) => {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    console.error(error)
  }, [error])

  const [title, handleTitleChange, setTitleError] = useInput({});
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setTitleError();

    if(!title.value.length)
      return setTitleError(true, "Can't be empty");

    try{
      setLoading(true);
    }catch(error){
      console.error(error);
      setError("Failed to add request.")
    }
    setLoading(false);

  }

  return <div className="fixed inset-0 grid place-items-center z-50">
    <div className="absolute inset-0 bg-black/70"></div>
    <div className="relative bg-white w-full max-w-[400px] shadow-lg rounded-3xl border-[1px] border-gray-600 z-2 flex flex-col items-center gap-4 px-8 py-12 pt-14">
      <CloseModal onClick={closeModal} top="1rem" right="1rem" />
      <h1 className="font-bold text-4xl text-black mb-2">
        Request a Tutorial
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-4"
      >
        <Input 
          placeholder="Title"
          value={title.value}
          onChange={handleTitleChange}
          isError={title.isError}
          errorMessage={title.errorMessage}
        />
        <Button
          loading={loading}
          disabled={loading}
        >
          Send Request
        </Button>
      </form>
    </div>  
  </div>
}

export default RequestModal
