import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/blog-posts";
import { SITE_URL } from "@/lib/seo";

interface BlogArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: "Annex.lk",
      publishedTime: post.date,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const commonMistakes = [
    "Rushing into a decision without comparing at least three similar options.",
    "Skipping written documentation for important terms and responsibilities.",
    "Ignoring long-term costs such as utilities, maintenance, and commute impact.",
  ];

  const actionPlan = post.tips ?? [
    "Create a checklist with must-haves and nice-to-haves before your next viewing.",
    "Verify all key terms in writing and keep screenshots of listing details.",
    "Do a final re-check of safety, payments, and support contacts before committing.",
  ];

  return (
    <main className="bg-background pb-20">
      <section className="relative h-[40vh] min-h-[320px] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-4xl flex-col justify-end px-6 pb-10 text-white">
          <Link
            href="/blog"
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest backdrop-blur"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to blog
          </Link>

          <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight md:text-5xl">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/90">
            <span className="inline-flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-3xl px-6">
        <p className="mb-8 text-xl font-semibold leading-relaxed text-foreground/90">
          {post.excerpt}
        </p>

        <div className="space-y-6 text-base leading-8 text-muted-foreground">
          {post.content.map((paragraph, index) => (
            <p key={`${post.slug}-paragraph-${index}`}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-card p-7">
          <h2 className="mb-4 text-lg font-black tracking-tight text-foreground">Why This Matters</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            In the {post.category.toLowerCase()} context, making clear and informed decisions helps you avoid avoidable
            costs, reduce stress, and create a more stable rental experience. The right process is often what separates a
            short-term fix from a long-term, comfortable outcome.
          </p>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-foreground">Common Mistakes to Avoid</h2>
          <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
            {commonMistakes.map((mistake) => (
              <li key={mistake} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 rounded-3xl border border-border/70 bg-gradient-to-br from-card to-muted/20 p-7">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-foreground">Action Plan</h2>
          <ol className="space-y-4 text-sm leading-7 text-muted-foreground">
            {actionPlan.map((step, index) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-black text-primary">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {post.tips && post.tips.length > 0 && (
          <div className="mt-10 rounded-3xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-black tracking-tight text-foreground">Quick Tips</h2>
            <ul className="space-y-3 text-sm font-medium text-muted-foreground">
              {post.tips.map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 rounded-3xl border border-primary/20 bg-primary/5 p-7">
          <h2 className="mb-3 text-xl font-black tracking-tight text-foreground">Final Takeaway</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Small improvements in how you evaluate, document, and communicate can significantly improve results on both
            the tenant and landlord side. Use this guide as a repeatable framework whenever you review listings or manage
            your next rental decision.
          </p>
        </div>
      </section>
    </main>
  );
}
