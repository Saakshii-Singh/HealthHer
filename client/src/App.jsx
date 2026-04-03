import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; 
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";

function Home() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl">
        Welcome to HealthHer 💖
      </h1>

      {/* 👇 ADD THIS */}
      <h1 className="text-4xl text-pink-500 mt-5">
        Tailwind Working 💖
      </h1>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;