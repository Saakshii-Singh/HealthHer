import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-5 py-16 space-y-6">
        <h1 className="font-display text-4xl font-bold text-plum">About HealthHer</h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          HealthHer is a female-focused dashboard designed to make cycle logs, mental check-ins, and anonymous support chats easy to reach. We believe intimate care should be spoken about openly and without any shame.
        </p>
        <h2 className="font-display text-2xl font-bold text-plum mt-8">Our Privacy Covenant</h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Your personal data (cycles, logs, private notes) are secure in MongoDB under strict authenticated JWT sessions. The community forum operates with temporary floral nickname alias handles, keeping you completely anonymous.
        </p>
      </div>
      <SiteFooter />
    </div>
  );
}