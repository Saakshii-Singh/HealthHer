import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/50 py-12 text-sm text-muted-foreground">
      <div className="mx-auto max-w-6xl px-5 grid gap-8 sm:grid-cols-[2fr_1fr_1fr] items-start">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-soft transition-transform group-hover:scale-105">
              <Heart className="h-3.5 w-3.5" fill="currentColor" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-plum">
              HealthHer
            </span>
          </Link>
          <p className="max-w-xs text-xs leading-relaxed">
            A safe place for personalized wellness, intimate care education, and honest, judgment-free conversations. Gentle, private, and made with care.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-wider text-plum font-semibold">Features</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/dashboard" className="hover:text-primary transition-colors">Private Dashboard</Link>
            </li>
            <li>
              <Link to="/community" className="hover:text-primary transition-colors">Anonymous Chat</Link>
            </li>
            <li>
              <Link to="/resources" className="hover:text-primary transition-colors">Wellness Library</Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-wider text-plum font-semibold">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/about" className="hover:text-primary transition-colors">Our Mission</Link>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">Terms of Use</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>© {new Date().getFullYear()} HealthHer. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Made with <Heart className="h-3.5 w-3.5 text-primary" fill="currentColor" /> for women everywhere.
        </p>
      </div>
    </footer>
  );
}