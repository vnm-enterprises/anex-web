import { BadgeCheck } from "lucide-react";

export default function AuthImagePanel() {
  return (
    <aside className="hidden lg:block lg:w-1/2 relative h-full bg-slate-100 dark:bg-slate-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/register.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/60 to-transparent" />
      </div>

      {/* Quote */}
      <div className="absolute bottom-10 left-10 right-10 text-white p-6 backdrop-blur-sm bg-black/10 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 mb-2 text-primary">
          <BadgeCheck size={18} />
          <p className="font-medium text-sm uppercase tracking-wide">
            Verified Listings
          </p>
        </div>

        <h3 className="text-2xl font-bold leading-tight mb-2">
          “Finding a safe place to stay in Colombo was easier than I imagined.”
        </h3>

        <p className="text-white/80 text-sm">— Dilshan P., Happy Tenant</p>
      </div>
    </aside>
  );
}
