import { BadgeCheck } from "lucide-react";

export default function AuthImagePanel() {
  return (
    <aside className="hidden lg:block lg:w-1/2 relative h-full bg-slate-100 dark:bg-slate-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAIhmeVJkxbS9Hlw1U9MxT7m0ifFPxtfAvDfsO6q6BOiHmRE8ByPaAeRYb00PyFKf1qLVb5XNembjAb2e2cNYxE6wg12BeUsg2URYq_svlFS21LIw-6HHjCItkCJij4mZVv2dvScEuDM-Y49WBmg_xRow7TxZ0gaKQczib8bKacu08NNqXrzfRzgcMRxL_s5VCZZiMtHvoHa0YPq2F2SzNQJEd8zZ7kACfjfizYnwUM6_aF_tdFrLUpWUzVxqZHM-gpPznyy6gTAek')",
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
