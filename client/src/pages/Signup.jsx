import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const {data}=await axios.post("http://localhost:5000/api/auth/register",{
                name,email,password,
            });
            localStorage.setItem("userInfo",JSON.stringify(data));
            alert("Signup Successful");
            navigate("/dashboard");
        } catch (error) {
            alert(error.response?.data?.message || "Signup Failed");
        }
    };
    return (
        <div className="flex justify-center mt-20">
            <form onSubmit={submitHandler} className="p-6 border rounded">
                <h2 className="text-2xl font-bold mb-4">Signup</h2>
                {/*Name*/}
                <input
                 type="text"
                 placeholder="Enter Name"
                 className="border p-2 block mb-3 w-full"
                 onChange={(e)=>setName(e.target.value)}
                 required
                 />
                 {/*Email*/}
                 <input 
                 type="email"
                 placeholder="Enter email"
                 className="border p-2 block mb-3 w-full"
                 onChange={(e)=>setEmail(e.target.value)}
                 required
                  />
                  {/*Password*/}
                  <input 
                  type="password"
                  placeholder="Enter password"
                 className="border p-2 block mb-3 w-full"
                 onChange={(e)=>setPassword(e.target.value)}
                 required
                   />
                   <button
                   className="bg-pink-500 text-white px-4 py-2 rounded w-full">SignUp</button>
            </form>
        </div>
            );
        }
export default Signup;