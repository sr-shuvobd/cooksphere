"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  FaUtensils,
  FaLeaf,
  FaIceCream,
  FaGlassMartiniAlt,
  FaHeartbeat,
  FaHamburger,
  FaFire
} from "react-icons/fa";

export default function TopCategories() {
  const categories = [
    { name: "Pasta", icon: <FaUtensils className="mx-auto text-4xl text-orange-500 transition-transform group-hover:scale-110 duration-300" /> },
    { name: "Soup", icon: <FaUtensils className="mx-auto text-4xl text-orange-500 transition-transform group-hover:scale-110 duration-300" /> },
    { name: "Salad", icon: <FaLeaf className="mx-auto text-4xl text-emerald-500 transition-transform group-hover:scale-110 duration-300" /> },
    { name: "Dessert", icon: <FaIceCream className="mx-auto text-4xl text-pink-500 transition-transform group-hover:scale-110 duration-300" /> },
    { name: "Drinks", icon: <FaGlassMartiniAlt className="mx-auto text-4xl text-blue-500 transition-transform group-hover:scale-110 duration-300" /> },
    { name: "Healthy", icon: <FaHeartbeat className="mx-auto text-4xl text-red-500 transition-transform group-hover:scale-110 duration-300" /> },
    { name: "Main Course", icon: <FaHamburger className="mx-auto text-4xl text-amber-500 transition-transform group-hover:scale-110 duration-300" /> },
    { name: "BBQ", icon: <FaFire className="mx-auto text-4xl text-red-600 transition-transform group-hover:scale-110 duration-300" /> },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 12 }
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-[#021c17] overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center text-4xl font-black text-stone-900 dark:text-white mb-14">
            Top Categories
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          {categories.map((item) => (
            <Link
              key={item.name}
              href={`/browse-recipes?category=${encodeURIComponent(item.name)}`}
              className="group"
            >
              <motion.div
                variants={itemVariants}
                className="rounded-3xl p-6 text-center bg-stone-55 dark:bg-[#03241f] border border-stone-100 dark:border-white/5 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-lg shadow-stone-100 dark:shadow-none flex flex-col justify-center cursor-pointer h-full"
              >
                {item.icon}
                <h3 className="mt-4 font-black text-sm text-stone-850 dark:text-stone-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-450 transition-colors">
                  {item.name}
                </h3>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}