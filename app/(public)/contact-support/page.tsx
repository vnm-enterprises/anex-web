import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  ArrowRight,
} from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <main className="bg-background">
      {/* ================= HERO ================= */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=2200"
          alt="Customer support team helping clients"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/45 via-background/30 to-background/70" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-6">
            We're Here to <span className="text-primary italic">Help You</span>.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Have questions about a listing, payments, or our platform? Our
            specialized support team is ready to assist you.
          </p>
        </div>
      </section>

      {/* ================= CONTACT GRID ================= */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Mail,
                title: "Email Support",
                detail: "annexlk1@gmail.com",
                desc: "Average response time: 2 hours",
                href: "mailto:annexlk1@gmail.com",
              },
              {
                icon: Phone,
                title: "Phone Support",
                detail: "+94 757529581",
                desc: "Mon - Fri, 9am - 6pm SLST",
                href: "tel:+94757529581",
              },
              {
                icon: MessageSquare,
                title: "Live Chat",
                detail: "Chat with Us",
                desc: "Available for Pro users 24/7",
                href: "#",
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="group p-10 rounded-[2.5rem] bg-card border border-border/50 soft-shadow hover:border-primary/30 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-primary font-bold text-lg mb-1">
                  {item.detail}
                </p>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </a>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Form */}
            <ContactForm />

            {/* Info */}
            <div className="space-y-12 py-12">
              <div>
                <h2 className="text-3xl font-black text-foreground tracking-tighter mb-6">
                  Visit Our <span className="text-primary italic">Office</span>
                </h2>
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground mb-1">
                      Colombo HQ
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      glapoththta road , pore athurugiria ,
                      <br />
                      colombo sri lanka.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[2rem] bg-muted/30 border border-dashed border-border/50">
                <h4 className="font-black text-lg mb-4 flex items-center gap-2">
                  <Clock className="text-primary h-5 w-5" /> Support Hours
                </h4>
                <div className="space-y-2 text-sm font-bold text-muted-foreground">
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span>Monday - Friday</span>
                    <span className="text-foreground">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span>Saturday</span>
                    <span className="text-foreground">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-emerald-500">
                      Online Support Only
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-[2.5rem] p-10 border border-primary/10">
                <h4 className="text-xl font-black text-foreground mb-4 italic">
                  Safety First!
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-medium">
                  Never share your password or payment details over email or
                  chat. Annex.lk support will never ask for your private payment
                  credentials.
                </p>
                <a
                  href="/safety-center"
                  className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:underline"
                >
                  Visit Safety Center <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
