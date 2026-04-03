import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));

      alert("Signup Successful 💖");
      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Signup Failed ❌");
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
        <h2 className="text-2xl font-bold text-pink-500 mb-4 text-center">
          Signup 💖
        </h2>

        <div className="flex items-center border p-2 mb-3 rounded">
          <FaUser className="text-pink-400 mr-2" />
          <input
            type="text"
            placeholder="Name"
            className="outline-none w-full bg-transparent"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center border p-2 mb-3 rounded">
          <FaEnvelope className="text-pink-400 mr-2" />
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
          Signup
        </button>
      </motion.form>
    </div>
  );
}

export default Signup;