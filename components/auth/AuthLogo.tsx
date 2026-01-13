import { Home } from "lucide-react";

export default function AuthLogo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark shadow-lg shadow-primary/20">
        <Home size={18} />
      </div>
      <span
        className={`font-bold tracking-tight ${
          dark ? "text-white" : "text-text-main dark:text-white"
        }`}
      >
        annex.lk
      </span>
    </div>
  );
}
