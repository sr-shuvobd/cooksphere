"use client";

import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaUsers,
  FaUtensils,
  FaTrophy,
  FaBowlFood,
} from "react-icons/fa6";
import { MdRestaurantMenu } from "react-icons/md";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-stone-50 dark:bg-[#021c17] py-6 lg:py-10 transition-colors duration-300">
      <div className="container max-w-7xl mx-auto px-4">
        <div
          className="relative overflow-hidden rounded-[32px] shadow-xl border border-stone-200/50 dark:border-stone-800/40"
          style={{
            backgroundImage: "url('/bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center right",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/75 to-stone-950/30 dark:from-black/90 dark:via-black/75 dark:to-black/30" />

          <div className="relative z-10">
            {/* Hero Content */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center px-6 md:px-10 lg:px-14 py-12 lg:py-20">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center gap-2 border border-emerald-400 dark:border-orange-500 rounded-full px-4 py-2 text-white bg-emerald-950/40 dark:bg-black/40 backdrop-blur-md mb-6 shadow-sm">
                  <FaUtensils className="text-emerald-400 dark:text-orange-400" />
                  <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">
                    Cook. Share Inspire.
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-[1.15] text-white tracking-tight">
                  Discover, Share &
                  <br />
                  Cook{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-350 dark:from-orange-400 dark:to-amber-300 font-black">
                    Amazing Recipes
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-stone-200 dark:text-gray-300 text-base md:text-lg leading-relaxed font-medium">
                  Explore thousands of delicious recipes from around the world.
                  Share your culinary creations, save your favorites, and join
                  our passionate food community.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link
                    href="/browse-recipes"
                    className="bg-emerald-600 hover:bg-emerald-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold shadow-lg shadow-emerald-950/30 dark:shadow-black/50 transition-all duration-300 cursor-pointer flex items-center p-3 rounded-full"
                    // startContent={<FaBowlFood className="text-lg" />}
                  >
                    Browse Recipes
                  </Link>

                  <Link
                    href="/dashboard"
                    className="text-white border border-white/80 hover:bg-white/10 font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 px-5 py-3 rounded-full"
                  >
                    <MdRestaurantMenu className="text-lg" />
                    Share Your Recipe
                  </Link>
                </div>
              </motion.div>

              {/* Right Column (Floating Cards) */}
              <div className="hidden lg:flex justify-end relative min-h-[350px]">
                {/* Happy Cooks Card */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="absolute top-8 right-12 hover:scale-105 transition-transform duration-300"
                >
                  <div className="bg-white/95 dark:bg-[#03241f]/90 backdrop-blur-xl border border-stone-200/50 dark:border-white/10 rounded-3xl px-6 py-5 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500 dark:bg-orange-500 flex items-center justify-center text-white shadow-md">
                        <FaUsers className="text-lg" />
                      </div>

                      <div>
                        <h3 className="text-2xl font-black text-stone-850 dark:text-white">
                          50K+
                        </h3>

                        <p className="text-xs sm:text-sm font-semibold text-stone-500 dark:text-stone-400">
                          Happy Cooks
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Tasty Recipes Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9 }}
                  className="absolute bottom-8 right-0 hover:scale-105 transition-transform duration-300"
                >
                  <div className="bg-white/95 dark:bg-[#03241f]/90 backdrop-blur-xl border border-stone-200/50 dark:border-white/10 rounded-3xl px-6 py-5 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500 dark:bg-orange-500 flex items-center justify-center text-white shadow-md">
                        <FaBowlFood className="text-lg" />
                      </div>

                      <div>
                        <h3 className="text-2xl font-black text-stone-850 dark:text-white">
                          5K+
                        </h3>

                        <p className="text-xs sm:text-sm font-semibold text-stone-500 dark:text-stone-400">
                          Tasty Recipes
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Bottom Stats Banner */}
            <div className="px-6 md:px-10 lg:px-14 pb-8 lg:pb-12 mb-3">
              <div className="bg-white/95 dark:bg-[#03241f]/90 backdrop-blur-xl rounded-[24px] border border-stone-200/50 dark:border-white/10 p-6 sm:p-8 shadow-xl">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  <StatCard icon={<FaUtensils />} value="5K+" label="Recipes" />

                  <StatCard
                    icon={<FaUsers />}
                    value="10K+"
                    label="Active Users"
                  />

                  <StatCard
                    icon={<FaHeart />}
                    value="50K+"
                    label="Recipe Likes"
                  />

                  <StatCard
                    icon={<FaTrophy />}
                    value="15+"
                    label="Categories"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 dark:bg-white/10 flex items-center justify-center text-emerald-600 dark:text-white text-xl shadow-inner">
        {icon}
      </div>

      <div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-stone-800 dark:text-white">
          {value}
        </h3>

        <p className="text-stone-500 dark:text-stone-450 text-xs sm:text-sm font-semibold">
          {label}
        </p>
      </div>
    </div>
  );
}
