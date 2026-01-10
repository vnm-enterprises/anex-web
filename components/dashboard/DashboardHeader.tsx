"use client";

import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardHeader() {
  const router = useRouter();
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      {/* Left */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
          Welcome back, Mr. Perera
        </h1>
        <p className="text-emerald-600 dark:text-primary text-base md:text-lg">
          Here is what&apos;s happening with your properties today.
        </p>
      </div>

      {/* Right */}
      <button
        className="flex items-center gap-2 bg-primary hover:bg-primary/90
                   text-gray-900 font-bold px-5 py-2.5 rounded-lg
                   shadow-lg shadow-primary/20
                   transition-all active:scale-95
                   self-start md:self-auto cursor-pointer"
        onClick={() => {router.push('/dashboard/post-ad')}}
      >
        <span className="material-symbols-outlined text-[20px]"><PlusCircle /></span>
        <span>Post New Ad</span>
      </button>
    </div>
  );
}
