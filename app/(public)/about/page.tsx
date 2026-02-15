import Link from "next/link"
import {
  ArrowDown,
  Verified,
  Flag,
  Eye,
  Linkedin,
  Code,
  Clock,
  Megaphone,
  Headphones,
} from "lucide-react"

export default function AboutPage() {
  return (
    <main className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200">

      {/* ================= HERO ================= */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
            className="w-full h-full object-cover"
            alt="Modern tropical villa in Sri Lanka"
          />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-semibold mb-6 uppercase tracking-wider">
            Our Story
          </span>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Reimagining Rental Living in{" "}
            <span className="text-primary">Sri Lanka</span>.
          </h1>

          <p className="text-lg text-slate-200 mb-10 max-w-2xl mx-auto">
            We are building the digital infrastructure for long-term stays —
            from Colombo’s skyline to the southern coast.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#mission"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              Read Our Mission <ArrowDown size={16} />
            </a>

            <a
              href="#careers"
              className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white px-8 py-3.5 rounded-lg font-semibold transition"
            >
              View Open Roles
            </a>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="-mt-12 relative z-20 max-w-6xl mx-auto px-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "5,000+", label: "Active Listings" },
            { value: "50+", label: "Cities Covered" },
            { value: "12k+", label: "Happy Tenants" },
            { value: "24/7", label: "Support" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section id="mission" className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2070"
              className="rounded-2xl shadow-2xl h-[500px] w-full object-cover"
              alt="Mission"
            />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Simplifying the search for a home away from home.
            </h2>

            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
              Finding long-term rentals in Sri Lanka has historically been fragmented.
              Annex.lk changes that with trust, transparency, and digital simplicity.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Flag />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Our Mission</h3>
                  <p className="text-slate-500">
                    Create a transparent, efficient rental marketplace across Sri Lanka.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Eye />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Our Vision</h3>
                  <p className="text-slate-500">
                    Become the digital backbone of Sri Lankan residential real estate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="py-24 bg-white dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <span className="text-primary uppercase text-sm font-semibold">
            The Minds Behind the Platform
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4">
            Meet the Team
          </h2>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Arjuna Perera", role: "Founder & CEO" },
            { name: "Sarah De Silva", role: "Chief Technology Officer" },
            { name: "Kasun Jayawardena", role: "Head of Product" },
            { name: "Nimali Fernando", role: "Lead Designer" },
          ].map((member) => (
            <div key={member.name} className="group text-center">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2070"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition"
                  alt={member.name}
                />
              </div>
              <h3 className="font-bold">{member.name}</h3>
              <p className="text-primary text-sm">{member.role}</p>
              <a className="inline-flex items-center text-slate-400 hover:text-primary text-sm mt-2">
                LinkedIn <Linkedin size={14} className="ml-1" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CAREERS ================= */}
      <section id="careers" className="py-24 relative">
        <div className="max-w-5xl mx-auto px-6 text-center mb-16">
          <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold uppercase">
            We Are Hiring
          </span>
          <h2 className="text-4xl font-bold mt-6 mb-6">
            Build the Future with Us
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Join a team shaping Sri Lanka’s digital rental infrastructure.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-6 space-y-4">
          {[
            { title: "Senior Full Stack Developer", icon: Code },
            { title: "Product Marketing Manager", icon: Megaphone },
            { title: "Customer Success Specialist", icon: Headphones },
          ].map((job) => (
            <div
              key={job.title}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border hover:border-primary/40 transition"
            >
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <div className="flex items-center gap-4 text-slate-500 text-sm mt-1">
                    <span className="flex items-center gap-1">
                      <job.icon size={16} /> Full-time
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} /> Posted Recently
                    </span>
                  </div>
                </div>
                <button className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-primary hover:text-white rounded-lg font-semibold transition">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-5xl mx-auto px-6 mt-12 bg-primary/10 p-8 rounded-2xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-bold mb-2">
              Don’t see your perfect role?
            </h4>
            <p className="text-slate-600 dark:text-slate-400">
              Send us your CV — we’re always looking for talent.
            </p>
          </div>
          <button className="bg-white dark:bg-slate-800 text-primary hover:bg-primary hover:text-white border border-primary/30 px-6 py-3 rounded-lg font-semibold transition">
            Send General Inquiry
          </button>
        </div>
      </section>

    </main>
  )
}
