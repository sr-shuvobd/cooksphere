"use client";

import Link from "next/link";
import { FaUtensils } from "react-icons/fa";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-stone-100 via-stone-50 to-emerald-50 dark:from-[#021c17] dark:via-[#03241f] dark:to-[#021c17]">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-500 dark:border-orange-400 bg-emerald-50 dark:bg-[#042d25] animate-bounce">
            <FaUtensils className="text-3xl text-emerald-600 dark:text-orange-400" />
          </div>
        </div>
        
        <h1 className="text-9xl font-black text-emerald-600 dark:text-orange-400 tracking-widest">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-stone-800 dark:text-white">
          Page Not Found
        </h2>
        
        <p className="text-stone-500 dark:text-stone-400 font-medium">
          The recipe page you are looking for does not exist or has been moved. Let's get you back to cooking!
        </p>
        
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold shadow-lg transition-all duration-300"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
