import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (loading) return; // 🚫 prevent double click
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password }
      );

      console.log("SUCCESS:", data);

      // store user info
      localStorage.setItem("userInfo", JSON.stringify(data));

      alert("Signup Successful ✅");

      // 🔥 redirect to login page
      navigate("/login");

    } catch (error) {
      console.log("ERROR:", error.response?.data);

      alert(
        error.response?.data?.message || "Signup Failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <form onSubmit={submitHandler} className="p-6 border rounded">
        <h2 className="text-xl mb-4 font-bold">Signup</h2>

        {/* Name */}
        <input
          type="text"
          placeholder="Enter name"
          className="border p-2 block mb-3 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Enter email"
          className="border p-2 block mb-3 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter password"
          className="border p-2 block mb-3 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 w-full rounded"
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
}

export default Signup;