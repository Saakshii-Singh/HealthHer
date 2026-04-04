import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaLock } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));

      alert("Login Successful ");
      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Login Failed ❌");
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <motion.form
        onSubmit={submitHandler}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-md p-8 rounded-xl shadow-xl w-80"
      >
        <h2 className="text-2xl font-bold text-pink-500 mb-4 text-center flex justify-center gap-2">
          <FaUser /> Login 
        </h2>

        <div className="flex items-center border p-2 mb-3 rounded">
          <FaUser className="text-pink-400 mr-2" />
          <input
            type="email"
            placeholder="Email"
            className="outline-none w-full bg-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center border p-2 mb-3 rounded">
          <FaLock className="text-pink-400 mr-2" />
          <input
            type="password"
            placeholder="Password"
            className="outline-none w-full bg-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="bg-pink-500 text-white w-full py-2 rounded">
          Login
        </button>
      </motion.form>
    </div>
  );
}

export default Login;