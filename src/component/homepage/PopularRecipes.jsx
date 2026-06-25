"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaHeart, FaChevronRight, FaClock } from "react-icons/fa";
import { motion } from "motion/react";

export default function PopularRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/recipes?sortBy=likesCount&limit=4`);
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
    fetchPopular();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-stone-100 dark:bg-[#011411]">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-500 font-semibold">Loading popular recipes...</p>
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
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 70, damping: 14 }
    }
  };

  return (
    <section className="py-20 bg-stone-100 dark:bg-[#011411] overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-black text-stone-900 dark:text-white">
            Popular Recipes
          </h2>
          <p className="text-stone-550 mt-3 font-medium">
            Highly loved and most liked culinary creations from our chefs.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {recipes.map((recipe) => (
            <motion.div
              key={recipe._id}
              variants={cardVariants}
              className="rounded-3xl bg-white dark:bg-[#03241f] p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border border-stone-100 dark:border-white/5 flex flex-col justify-between group"
            >
              <div>
                <div className="overflow-hidden rounded-2xl mb-4 border border-stone-200/50 dark:border-white/5">
                  <img
                    src={recipe.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300"}
                    alt={recipe.recipeName}
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <span className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                  {recipe.category}
                </span>

                <h3 className="font-extrabold text-lg text-stone-900 dark:text-white mt-2 line-clamp-1">
                  {recipe.recipeName}
                </h3>

                <div className="flex items-center gap-4 text-[10px] text-stone-500 mt-2 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1"><FaClock /> {recipe.preparationTime} min</span>
                  <span className="flex items-center gap-1"><FaHeart className="text-red-500" /> {recipe.likesCount || 0} Likes</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-white/5 flex items-center justify-between">
                <p className="text-[10px] text-stone-400 dark:text-stone-550 font-semibold truncate max-w-[100px]">
                  By {recipe.authorName || "Anonymous"}
                </p>

                <Link
                  href={`/browse-recipes/${recipe._id}`}
                  className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-450 hover:text-emerald-500 font-black text-[10px] uppercase tracking-wider transition-all"
                >
                  Details <FaChevronRight className="text-[6px]" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}