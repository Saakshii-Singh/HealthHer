import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PeriodTracker from "./pages/PeriodTracker";
import Profile from "./pages/Profile";
import AiAssistant from "./pages/AiAssistant";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tracker" element={<PeriodTracker />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai-assistant" element={<AiAssistant />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;