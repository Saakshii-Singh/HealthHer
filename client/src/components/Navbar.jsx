import { Link, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white/60 backdrop-blur-md shadow-md">
      
      <h1 className="text-xl font-bold text-pink-500 flex items-center gap-2">
        HealthHer <FaHeart />
      </h1>

      <div className="flex gap-5 items-center">
        <Link to="/">Home</Link>

        {user ? (
          <>
            <span className="text-pink-500 font-semibold">
              {user.name} 
            </span>

            <button
              onClick={() => {
                localStorage.removeItem("userInfo");
                navigate("/login");
              }}
              className="bg-pink-400 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="bg-pink-500 text-white px-3 py-1 rounded">
              Signup
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;