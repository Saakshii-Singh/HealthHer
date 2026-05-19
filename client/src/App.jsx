import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Resources from "./pages/Resources";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import AICompanion from "./pages/AICompanion";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/community" element={<Community />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai" element={<AICompanion />} />
      </Routes>
    </Router>
  );
}