import { PostAdButton } from "@/components/home/post-ad-button";

export function CtaSection() {
  return (
    <section className="relative rounded-[3rem] overflow-hidden group border border-primary/20 shadow-2xl shadow-primary/10">
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent" />
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] group-hover:scale-110 transition-transform duration-10000" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_50%)]" />

      <div className="relative z-10 py-16 px-10 md:px-20 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-2xl text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-tight">
            Ready to list your property?
          </h2>
          <p className="text-white/90 text-lg md:text-xl font-medium leading-relaxed">
            Join thousands of landlords finding verified tenants on RENTR.
            Post your first listing for free — no hidden fees.
          </p>
        </div>
        <div className="shrink-0">
          <PostAdButton className="bg-white text-primary hover:bg-white/90 text-lg font-black h-16 px-12 rounded-2xl shadow-2xl shadow-black/20 transition-all hover:scale-105" />
        </div>
      </div>
    </section>
  );
}
