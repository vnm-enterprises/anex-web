import { ReactNode } from "react";

type LegalLayoutProps = {
  title: string;
  children: ReactNode;
};

export default function LegalLayout({
  title,
  children,
}: LegalLayoutProps) {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">
        {title}
      </h1>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        {children}
      </div>
    </main>
  );
}
