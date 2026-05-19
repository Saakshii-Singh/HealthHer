import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

const mainNav = [
  { to: "/", label: "Home" },
  { to: "/resources", label: "Resources" },
  { to: "/community", label: "Community" },
  { to: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState(null);

  const checkUser = () => {
    const token = localStorage.getItem("hh_token");
    const savedUser = localStorage.getItem("hh_user");
    if (token && savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { setUser(null); }
    } else { setUser(null); }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener("hh_login_state_change", checkUser);
    return () => window.removeEventListener("hh_login_state_change", checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("hh_token");
    localStorage.removeItem("hh_user");
    setUser(null);
    window.dispatchEvent(new Event("hh_login_state_change"));
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-white shadow-soft transition-transform group-hover:scale-105">
            <Heart className="h-4 w-4" fill="currentColor" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-plum">HealthHer</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname === item.to ? "bg-secondary text-plum" : "text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard" ? "bg-secondary text-plum" : "text-muted-foreground hover:bg-secondary/50"
                }`}
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2 pl-2">
                <span className="flex items-center gap-1 text-sm font-bold text-plum">
                  <User className="h-4 w-4" /> {user.username}
                </span>
                <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-red-500">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <Link to="/dashboard" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-secondary">
              Log In
            </Link>
          )}

          <Link to="/community" className="ml-2 rounded-full bg-gradient-primary px-5 py-2 text-sm font-bold text-white shadow-soft hover:shadow-glow">
            Join the chat
          </Link>
        </nav>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-border px-5 py-4 flex flex-col gap-2">
          {mainNav.map(n => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="px-3 py-2 hover:bg-secondary rounded-lg text-sm">{n.label}</Link>
          ))}
          {user ? (
            <Link to="/dashboard" onClick={() => setOpen(false)} className="px-3 py-2 text-plum font-bold">Dashboard</Link>
          ) : (
            <Link to="/dashboard" onClick={() => setOpen(false)} className="px-3 py-2">Log In</Link>
          )}
          <Link to="/community" onClick={() => setOpen(false)} className="bg-gradient-primary text-white text-center py-2.5 rounded-lg text-sm font-bold mt-2">Anonymous Chat</Link>
        </div>
      )}
    </header>
  );
}