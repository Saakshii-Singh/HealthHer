import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav className="bg-pink-100 shadow-md px-6 py-4 flex justify-between items-center">
      
      {/* Logo */}
      <h1 className="text-2xl font-bold text-pink-500">
        HealthHer 💖
      </h1>

      {/* Links */}
      <div className="flex items-center gap-6 text-gray-700 font-medium">
        
        <Link to="/" className="hover:text-pink-500 transition">
          Home
        </Link>

        {!user ? (
          <>
            <Link to="/login" className="hover:text-pink-500 transition">
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-pink-400 text-white px-3 py-1 rounded-lg hover:bg-pink-500 transition"
            >
              Signup
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="hover:text-pink-500 transition">
              Dashboard
            </Link>

            <button
              onClick={logoutHandler}
              className="bg-rose-400 text-white px-3 py-1 rounded-lg hover:bg-rose-500 transition"
            >
              Logout 💕
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;