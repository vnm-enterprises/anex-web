export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content: string[];
  tips?: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-find-the-best-annex-in-colombo",
    title: "How to Find the Best Annex in Colombo",
    excerpt:
      "A comprehensive guide on what to look for, from location to amenities and legal agreements.",
    category: "Guides",
    date: "Feb 20, 2026",
    readTime: "5 min read",
    image:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1600",
    content: [
      "Start with commute time before price. A place that saves one hour daily often gives better value than a slightly cheaper option far from your office or campus.",
      "Inspect water pressure, natural light, phone signal, and nighttime noise. These small details have the biggest effect on day-to-day comfort.",
      "Always request a written agreement that clearly states monthly rent, utility sharing, deposit terms, and notice period to avoid disputes later.",
    ],
    tips: [
      "Visit at two different times of day.",
      "Ask about utility history for the last 3 months.",
      "Confirm who handles maintenance and repairs.",
    ],
  },
  {
    slug: "5-tips-for-landlords-to-attract-verified-tenants",
    title: "5 Tips for Landlords to Attract Verified Tenants",
    excerpt:
      "Improve your listing visibility and attract high-quality tenants with these simple optimization tips.",
    category: "Landlords",
    date: "Feb 18, 2026",
    readTime: "4 min read",
    image:
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600",
    content: [
      "Good photos are your first filter. Bright, uncluttered images with wide angles can dramatically improve inquiry rates.",
      "Write clear listing descriptions with exact rent, deposit, utility rules, and preferred tenant profile.",
      "Respond quickly to inquiries and keep your calendar updated. Fast response time builds trust before viewings.",
    ],
    tips: [
      "Add at least 8 photos including bathroom and kitchen.",
      "List nearby landmarks and commute time.",
      "Use verified badge features where available.",
    ],
  },
  {
    slug: "budget-friendly-rent-near-universities",
    title: "Budget-Friendly Rent Near Universities",
    excerpt:
      "How students can find safe, affordable annexes close to campus without compromising essentials.",
    category: "Students",
    date: "Feb 14, 2026",
    readTime: "6 min read",
    image:
      "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=1600",
    content: [
      "Create a non-negotiable checklist: safety, water reliability, and internet quality should be fixed requirements.",
      "Search in nearby neighborhoods instead of only the main university road. You often get better value one or two bus stops away.",
      "Pair up with a roommate when possible and split recurring costs like fiber internet and cleaning.",
    ],
  },
  {
    slug: "what-your-rental-agreement-should-include",
    title: "What Your Rental Agreement Should Include",
    excerpt:
      "Key clauses every tenant and landlord should verify before signing to avoid confusion later.",
    category: "Legal Basics",
    date: "Feb 10, 2026",
    readTime: "7 min read",
    image:
      "https://images.pexels.com/photos/48148/document-agreement-documents-sign-48148.jpeg?auto=compress&cs=tinysrgb&w=1600",
    content: [
      "A strong rental agreement defines payment due dates, grace periods, and penalties for late payment.",
      "It should include inventory details for furniture and appliances with current condition notes.",
      "Exit terms matter just as much as move-in terms. Review notice period, deposit return timeline, and restoration responsibilities.",
    ],
  },
  {
    slug: "safety-checklist-before-you-move-in",
    title: "Safety Checklist Before You Move In",
    excerpt:
      "A practical checklist to inspect safety features before committing to any rental space.",
    category: "Safety",
    date: "Feb 6, 2026",
    readTime: "5 min read",
    image:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1600",
    content: [
      "Check door locks, window latches, and exterior lighting around entrances and staircases.",
      "Verify emergency exits and ask whether the building has smoke alarms and fire extinguishers.",
      "Talk to neighbors briefly during a site visit. They can reveal practical safety concerns not listed online.",
    ],
  },
  {
    slug: "furnishing-a-small-annex-on-a-budget",
    title: "Furnishing a Small Annex on a Budget",
    excerpt:
      "Simple ideas to make compact spaces comfortable, efficient, and visually appealing.",
    category: "Lifestyle",
    date: "Feb 2, 2026",
    readTime: "6 min read",
    image:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600",
    content: [
      "Start with multipurpose furniture: storage beds, foldable tables, and stackable chairs free up floor area.",
      "Use vertical storage with wall shelves and hooks to keep frequently used items organized.",
      "Keep your color palette consistent to make the space look bigger and less visually crowded.",
    ],
  },
  {
    slug: "how-to-photograph-your-rental-listing",
    title: "How to Photograph Your Rental Listing",
    excerpt:
      "A step-by-step photo guide for landlords who want more clicks and viewings.",
    category: "Landlords",
    date: "Jan 30, 2026",
    readTime: "5 min read",
    image:
      "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=1600",
    content: [
      "Shoot during daylight and open all curtains. Natural lighting improves image quality more than expensive equipment.",
      "Use landscape orientation and keep camera height around chest level for realistic room perspective.",
      "Include detail photos for kitchen counters, wardrobes, and bathrooms so tenants can assess quality remotely.",
    ],
  },
  {
    slug: "utilities-and-internet-setup-for-new-tenants",
    title: "Utilities and Internet Setup for New Tenants",
    excerpt:
      "What to set up in your first week to avoid service interruptions and hidden costs.",
    category: "Moving",
    date: "Jan 25, 2026",
    readTime: "4 min read",
    image:
      "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=1600",
    content: [
      "Confirm meter ownership and billing responsibility for electricity and water before you move in.",
      "Test internet speed in your actual room, not only near the router, especially if you work remotely.",
      "Keep copies of utility account numbers and support contacts in one shared note for easy troubleshooting.",
    ],
  },
  {
    slug: "how-to-avoid-rental-scams-in-sri-lanka",
    title: "How to Avoid Rental Scams in Sri Lanka",
    excerpt:
      "Warning signs every renter should know before sending deposits or sharing personal documents.",
    category: "Safety",
    date: "Jan 20, 2026",
    readTime: "6 min read",
    image:
      "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1600",
    content: [
      "Never transfer money before physically viewing the property or confirming ownership through trusted proof.",
      "Be cautious if the price is far below market and the landlord pressures immediate payment.",
      "Use platforms with verification, traceable conversations, and clear report mechanisms.",
    ],
  },
  {
    slug: "how-to-negotiate-rent-with-confidence",
    title: "How to Negotiate Rent With Confidence",
    excerpt:
      "Practical negotiation tactics for tenants and landlords to reach fair, long-term agreements.",
    category: "Negotiation",
    date: "Jan 15, 2026",
    readTime: "5 min read",
    image:
      "https://images.pexels.com/photos/7642014/pexels-photo-7642014.jpeg?auto=compress&cs=tinysrgb&w=1600",
    content: [
      "Research recent rent trends in the same neighborhood so your offer is evidence-based, not emotional.",
      "Offer trade-offs such as longer lease duration or fewer custom requests when asking for a lower price.",
      "End negotiations with a written summary to avoid misunderstanding between verbal and final terms.",
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}