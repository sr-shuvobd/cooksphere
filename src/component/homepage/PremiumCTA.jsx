"use client";

import Link from "next/link";
import { FaCrown } from "react-icons/fa";
import { motion } from "motion/react";

export default function PremiumCTA() {
  return (
    <section className="py-20 bg-white dark:bg-[#021c17] overflow-hidden">
      <div className="container max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="rounded-[40px] bg-gradient-to-r from-emerald-600 to-teal-500 p-12 text-center text-white shadow-2xl relative overflow-hidden"
        >
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              rotate: [12, 15, 12]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -right-10 -bottom-10 opacity-10"
          >
            <FaCrown className="text-[200px]" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-black">
            Upgrade To Premium
          </h2>

          <p className="mt-4 text-sm md:text-base text-emerald-50 max-w-xl mx-auto leading-relaxed">
            Unlock unlimited recipe uploads, gain special profile badges, and enjoy unrestricted premium access today.
          </p>

          <div className="mt-8">
            <Link
              href="/dashboard"
              className="inline-block bg-white text-stone-900 font-black text-sm uppercase tracking-wider px-8 py-4 rounded-2xl shadow-md hover:bg-stone-50 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Upgrade Now
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}