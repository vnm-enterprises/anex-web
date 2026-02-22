import { ArrowRight, BookOpen, Clock, Tag } from "lucide-react";

export default function BlogPage() {
  const posts = [
    {
      title: "How to Find the Best Annex in Colombo",
      excerpt:
        "A comprehensive guide on what to look for, from location to amenities and legal agreements.",
      category: "Guides",
      date: "Feb 20, 2026",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1512918766671-ed62b9ae6586?q=80&w=2070",
    },
    {
      title: "5 Tips for Landlords to Attract Verified Tenants",
      excerpt:
        "Improve your listing's visibility and attract high-quality tenants with these simple optimization tips.",
      category: "Landlords",
      date: "Feb 18, 2026",
      readTime: "4 min read",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2070",
    },
  ];

  return (
    <main className="bg-background">
      {/* ================= HERO ================= */}
      <section className="relative pt-32 pb-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
            Annex Insights
          </span>
          <h1 className="text-4xl md:text-7xl font-black text-foreground tracking-tighter mb-8 max-w-4xl">
            Everything you need to know about{" "}
            <span className="text-primary italic">Rental Living</span>.
          </h1>
        </div>
      </section>

      {/* ================= BLOG GRID ================= */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {posts.map((post, i) => (
              <article key={i} className="group cursor-pointer">
                <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden mb-8 relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-lg">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} /> {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={14} /> {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed font-medium line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                      Read full article <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="mt-32 p-16 rounded-[3rem] bg-zinc-900 text-white overflow-hidden relative">
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-4xl font-black tracking-tighter mb-6 leading-none">
                Get rental tips and new listings{" "}
                <span className="text-primary">straight to your inbox</span>.
              </h3>
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="flex-1 h-16 rounded-2xl bg-white/10 border border-white/20 px-8 font-bold outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <button className="h-16 px-10 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all">
                  Subscribe
                </button>
              </form>
            </div>
            {/* Decorative Element */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
          </div>
        </div>
      </section>
    </main>
  );
}
