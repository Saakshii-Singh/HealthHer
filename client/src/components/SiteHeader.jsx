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

  // Check login state
  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem("hh_token");
      const savedUser = localStorage.getItem("hh_user");
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    checkUser();
    // Listen for storage changes or custom login events
    window.addEventListener("storage", checkUser);
    window.addEventListener("hh_login_state_change", checkUser);
    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("hh_login_state_change", checkUser);
    };
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
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-soft transition-transform group-hover:scale-105">
            <Heart className="h-4 w-4" fill="currentColor" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-plum">
            HealthHer
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-secondary text-plum"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard"
                    ? "bg-secondary text-plum"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                Dashboard
              </Link>
              <div className="h-4 w-[1px] bg-border mx-2"></div>
              <div className="flex items-center gap-2 pl-2">
                <span className="flex items-center gap-1 text-sm font-semibold text-plum">
                  <User className="h-4 w-4" />
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="h-4 w-[1px] bg-border mx-2"></div>
              <Link
                to="/dashboard"
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors"
              >
                Log In
              </Link>
            </>
          )}

          <Link
            to="/community"
            className="ml-2 rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-glow hover:scale-[1.02]"
          >
            Join the chat
          </Link>
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          aria-label="Toggle menu"
          className="md:hidden grid h-10 w-10 place-items-center rounded-full hover:bg-secondary text-plum"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-t border-border bg-background shadow-lg">
          <nav className="mx-auto max-w-6xl px-5 py-4 flex flex-col gap-2">
            {mainNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  location.pathname === item.to ? "bg-secondary text-plum" : "text-foreground hover:bg-secondary/50"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    location.pathname === "/dashboard" ? "bg-secondary text-plum" : "text-foreground hover:bg-secondary/50"
                  }`}
                >
                  Dashboard
                </Link>
                <div className="border-t border-border my-2"></div>
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-plum">
                    <User className="h-4 w-4" />
                    {user.username}
                  </span>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-1.5 text-xs text-destructive font-medium bg-red-50 px-2.5 py-1.5 rounded-full hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="border-t border-border my-2"></div>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-secondary text-center border border-border"
                >
                  Log In
                </Link>
              </>
            )}

            <Link
              to="/community"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft text-center"
            >
              Join the anonymous chat
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
