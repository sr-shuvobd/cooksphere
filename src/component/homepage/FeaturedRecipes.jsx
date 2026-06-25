"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaClock, FaHeart, FaChevronRight } from "react-icons/fa";
import { motion } from "motion/react";

export default function FeaturedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/recipes?isFeatured=true&limit=6`);
        const data = await response.json();
        if (data && data.recipes) {
          setRecipes(data.recipes);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-[#021c17]">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-500 font-semibold">Loading featured recipes...</p>
        </div>
      </section>
    );
  }

  if (recipes.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 15 }
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
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-black text-stone-900 dark:text-white">
            Featured Recipes
          </h2>
          <p className="text-stone-500 mt-3 font-medium">
            Handpicked recipes selected by our culinary experts and admins.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {recipes.map((recipe) => (
            <motion.div
              key={recipe._id}
              variants={cardVariants}
              className="rounded-3xl overflow-hidden bg-white dark:bg-[#03241f] shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-stone-100 dark:border-white/5 flex flex-col h-full group"
            >
              <div className="h-56 relative overflow-hidden">
                <img
                  src={recipe.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500"}
                  alt={recipe.recipeName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  ★ Featured
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-stone-550 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>{recipe.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><FaClock className="text-[10px]" /> {recipe.preparationTime} Min</span>
                </div>

                <h3 className="font-extrabold text-xl text-stone-900 dark:text-white line-clamp-1 mb-2">
                  {recipe.recipeName}
                </h3>

                <p className="text-xs text-stone-500 line-clamp-2 mb-6">
                  Created by {recipe.authorName || "Anonymous Chef"} ({recipe.authorEmail})
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-100 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 font-bold text-sm">
                    <FaHeart className="text-red-500" />
                    <span>{recipe.likesCount || 0} Likes</span>
                  </div>

                  <Link
                    href={`/browse-recipes/${recipe._id}`}
                    className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-450 hover:text-emerald-500 font-black text-xs uppercase tracking-wider transition-all"
                  >
                    View Details <FaChevronRight className="text-[8px]" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}