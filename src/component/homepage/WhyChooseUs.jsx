"use client";

import { motion } from "motion/react";
import {
  FaHeart,
  FaGlobe,
  FaCrown,
  FaBookOpen,
} from "react-icons/fa";

export default function WhyChooseUs() {
  const features = [
    {
      title: "Save Favorites",
      description: "Keep your favorite culinary experiments organized and easily accessible at any moment.",
      icon: <FaHeart className="text-3xl text-red-500" />
    },
    {
      title: "Premium Access",
      description: "Unlock unlimited recipe uploads and exclusive content curated by culinary experts.",
      icon: <FaCrown className="text-3xl text-amber-500" />
    },
    {
      title: "Global Recipes",
      description: "Discover unique recipes, tastes, and cooking styles from home chefs around the world.",
      icon: <FaGlobe className="text-3xl text-blue-500" />
    },
    {
      title: "Recipe Sharing",
      description: "Share your own signature recipes with a passionate, growing community of food lovers.",
      icon: <FaBookOpen className="text-3xl text-emerald-500" />
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 15 }
    }
  };

  return (
    <section className="py-20 bg-stone-100 dark:bg-[#011411] overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center text-4xl font-black text-stone-900 dark:text-white mb-14">
            Why Choose CookSphere?
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feat) => (
            <motion.div
              key={feat.title}
              variants={cardVariants}
              className="rounded-3xl bg-white dark:bg-[#03241f] p-8 border border-stone-200/45 dark:border-white/5 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-start group"
            >
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="p-3 bg-stone-50 dark:bg-[#021c17] rounded-2xl border border-stone-100 dark:border-white/5 transition-colors"
              >
                {feat.icon}
              </motion.div>
              <h3 className="mt-6 font-extrabold text-xl text-stone-900 dark:text-white">
                {feat.title}
              </h3>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}