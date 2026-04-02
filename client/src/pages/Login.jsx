import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    console.log("LOGIN HIT");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("LOGIN RESPONSE:", data);

      // store user info
      localStorage.setItem("userInfo", JSON.stringify(data));

      alert("Login Successful ✅");

      // ✅ correct redirect (ONLY this)
      navigate("/dashboard");

    } catch (error) {
      console.log("ERROR:", error.response?.data);

      alert(error.response?.data?.message || "Login Failed ❌");
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <form onSubmit={submitHandler} className="p-6 border rounded">
        <h2 className="text-xl mb-4 font-bold">Login</h2>

        {/* Email */}
        <div>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter email"
            className="border p-2 block mb-3 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter password"
            className="border p-2 block mb-3 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;