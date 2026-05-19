import { Link as RouterLink } from "react-router-dom";
import { Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white py-10 text-xs text-muted-foreground">
      <div className="mx-auto max-w-6xl px-5 grid gap-8 sm:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-3">
          <RouterLink to="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-primary text-white">
              <Heart className="h-3.5 w-3.5" fill="currentColor" />
            </span>
            <span className="font-display text-base font-bold text-plum">HealthHer</span>
          </RouterLink>
          <p className="max-w-xs leading-relaxed">
            A beautiful, safe place for cycle analytics, emotional log tracking, and judgment-free chat circles.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-plum uppercase tracking-wider">Features</h4>
          <div className="flex flex-col gap-1.5">
            <RouterLink to="/dashboard" className="hover:text-primary">Dashboard Hub</RouterLink>
            <RouterLink to="/community" className="hover:text-primary">Anonymous chat</RouterLink>
            <RouterLink to="/resources" className="hover:text-primary">Wellness library</RouterLink>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-plum uppercase tracking-wider">Platform</h4>
          <div className="flex flex-col gap-1.5">
            <RouterLink to="/about" className="hover:text-primary">Our Mission</RouterLink>
            <a href="#" className="hover:text-primary">Privacy Policy</a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-5 mt-8 pt-4 border-t border-border flex justify-between">
        <p>© {new Date().getFullYear()} HealthHer.</p>
        <p className="flex items-center gap-1">Made with 💗 for women.</p>
      </div>
    </footer>
  );
}