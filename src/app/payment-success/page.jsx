"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle, FaReceipt, FaCrown, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "recipe";
  const id = searchParams.get("id") || "";
  const amount = searchParams.get("amount") || "";
  const currency = searchParams.get("currency") || "USD";
  const txnId = searchParams.get("txnId") || "";

  const currencySymbol = currency === "BDT" ? "৳" : "$";

  return (
    <div className="bg-white dark:bg-[#03201b] border border-stone-200 dark:border-white/10 rounded-[32px] w-full max-w-lg shadow-2xl p-8 text-center space-y-8 animate-fadeIn text-stone-800 dark:text-stone-100">
      
      <div className="relative flex justify-center">
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center border border-emerald-200 dark:border-emerald-800/40 shadow-inner">
          <FaCheckCircle className="text-emerald-500 text-4xl" />
        </div>
        {type === "premium" && (
          <span className="absolute top-0 right-1/2 translate-x-10 bg-amber-500 text-white p-1.5 rounded-full shadow-lg text-xs">
            <FaCrown />
          </span>
        )}
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-black text-stone-900 dark:text-white leading-tight">
          Payment Successful!
        </h1>
        <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">
          {type === "premium"
            ? "Congratulations! You are now a premium member of CookSphere."
            : "Awesome! You have successfully unlocked this chef recipe."}
        </p>
      </div>

      <div className="bg-stone-50 dark:bg-[#021815] border border-stone-200 dark:border-white/5 rounded-2xl p-6 text-left space-y-4">
        <div className="flex items-center gap-2 text-stone-400 dark:text-stone-550 border-b border-stone-200 dark:border-white/5 pb-3">
          <FaReceipt className="text-sm" />
          <span className="text-[10px] font-black uppercase tracking-wider">
            Transaction Details
          </span>
        </div>

        <div className="space-y-2.5 text-xs font-bold text-stone-600 dark:text-stone-300">
          <div className="flex justify-between">
            <span className="text-stone-400 dark:text-stone-550">Transaction ID:</span>
            <span className="text-stone-900 dark:text-white font-black uppercase tracking-wide">
              {txnId || "TXN-SIMULATED-OK"}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-stone-400 dark:text-stone-555">Item description:</span>
            <span className="text-stone-900 dark:text-white capitalize">
              {type === "premium" ? "CookSphere Premium Plan" : "Single Recipe Unlock"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-stone-400 dark:text-stone-555">Status:</span>
            <span className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-350 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
              Paid / Unlocked
            </span>
          </div>

          <div className="flex justify-between border-t border-stone-200 dark:border-white/5 pt-3 mt-1.5 text-sm">
            <span className="font-extrabold text-stone-900 dark:text-white">Amount Paid:</span>
            <span className="font-black text-emerald-600 dark:text-emerald-450">
              {currencySymbol}
              {parseFloat(amount || "0").toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        {type === "recipe" && id ? (
          <>
            <Link
              href={`/browse-recipes/${id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-650 hover:bg-emerald-600 text-white font-extrabold text-xs py-4 rounded-2xl shadow-md transition-all cursor-pointer"
            >
              Go to Recipe <FaArrowRight />
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-700 dark:text-stone-300 font-extrabold text-xs py-4 rounded-2xl transition-all cursor-pointer"
            >
              <FaArrowLeft /> Dashboard
            </Link>
          </>
        ) : (
          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-650 hover:bg-emerald-650 text-white font-extrabold text-xs py-4 rounded-2xl shadow-md transition-all cursor-pointer"
          >
            Go to Dashboard <FaArrowRight />
          </Link>
        )}
      </div>

    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#021c17] flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="bg-white dark:bg-[#03201b] border border-stone-200 dark:border-white/10 rounded-[32px] w-full max-w-lg shadow-2xl p-8 flex flex-col items-center justify-center gap-4 text-stone-800 dark:text-stone-100">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-stone-500 dark:text-stone-400">Verifying transaction...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
