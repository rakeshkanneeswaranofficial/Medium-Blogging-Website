import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { SignupInput } from "@rakeshkanneeswaran/mediumblog-common/dist/zod"
import axios from "axios"
import { BACKEND_URL } from "../config"


export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        username: "",
        password: "",
    })

    const navigate = useNavigate()

    async function sendRequest() {

        try {
      
             const response =  await axios({
                method: 'post',
                url: `${BACKEND_URL}/api/v1/user/${type}`,
                data: postInputs
              });

            console.log(response.data.jwt)

            const jwt = response.data.jwt;

            localStorage.setItem("token", jwt);
            navigate("/blogs")

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="h-screen flex flex-col justify-center ">
            <div className="flex justify-center">
                <div>
                    <div className="text-3xl font-extrabold px-5">
                        Create a account
                    </div>
                    <div className="text-slate-400 text-centerkmln">
                        {type === "signin" ? "Don't have an accout?" : "Already have an account?"}
                        <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </div>
                    <div>
                        {type === "signup" ? <LabelledInput type="text" label="Name" placeholder="rakesh kanneeswaran" onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                name: e.target.value
                            })
                        }}></LabelledInput> : null}
                        <LabelledInput type="text" label="Username" placeholder="rakesh@gmail.com" onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                username: e.target.value
                            })
                        }}></LabelledInput>
                        <LabelledInput type="password" label="Password" placeholder="Rakesh kanneeswaran" onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                password: e.target.value
                            })
                        }}></LabelledInput>
                        <div className="pt-8">
                            <button type="button" onClick={sendRequest} className=" w-full py-2.5 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5  me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" >{type === "signup" ? "Signup" : "Signin"}</button>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    )
}



interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return (<div>
        <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
        <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>)
}