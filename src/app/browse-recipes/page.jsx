"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaClock,
  FaUtensils,
  FaChevronLeft,
  FaChevronRight,
  FaBookOpen,
  FaFilter,
} from "react-icons/fa";

export default function BrowseRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const categoriesList = [
    "Pizza",
    "Burger",
    "Dessert",
    "Asian",
    "Healthy",
    "BBQ",
    "Pasta",
    "Soup",
    "Salad",
    "Beverage",
    "Main Course",
  ];

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const categoryQuery = selectedCategories.length > 0 
        ? `&category=${selectedCategories.join(",")}` 
        : "";
      
      const response = await fetch(
        `http://localhost:5000/recipes?page=${page}&limit=12${categoryQuery}`
      );
      const data = await response.json();
      if (data) {
        setRecipes(data.recipes || []);
        setTotal(data.total || 0);
        setTotalPages(Math.ceil((data.total || 0) / 12) || 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [page, selectedCategories]);

  const handleCategoryToggle = (category) => {
    setPage(1);
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleClearFilters = () => {
    setPage(1);
    setSelectedCategories([]);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#021c17] text-stone-900 dark:text-stone-100 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-stone-900 dark:text-white flex items-center justify-center gap-3">
            <FaBookOpen className="text-emerald-600 dark:text-emerald-450" />
            Browse Recipes
          </h1>
          <p className="text-stone-500 dark:text-stone-300 max-w-2xl mx-auto">
            Discover a world of delicious recipes. Filter by categories to find exactly what you want.
          </p>
        </div>

        <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-stone-100 dark:shadow-none backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-stone-450 dark:text-stone-400 flex items-center gap-1.5">
              <FaFilter /> Filter by Category
            </h2>
            {selectedCategories.length > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-bold text-red-500 hover:text-red-400 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categoriesList.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/10"
                      : "bg-stone-55 dark:bg-[#021c17]/60 border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:border-emerald-500/50"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-stone-500 dark:text-stone-400">Loading delicious recipes...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white dark:bg-[#03241f]/10 border border-stone-200 dark:border-white/5 rounded-3xl">
            <p className="text-5xl">🍳</p>
            <h3 className="text-xl font-bold text-stone-850 dark:text-white">No Recipes Found</h3>
            <p className="text-sm text-stone-500 dark:text-stone-405">
              Try adjusting your search query or selecting other categories.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="bg-white dark:bg-[#03241f]/35 border border-stone-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg shadow-stone-100 dark:shadow-none hover:shadow-xl hover:shadow-stone-200/50 dark:hover:shadow-none transition-all duration-300 group flex flex-col h-full"
                >
                  <div className="relative h-48 w-full bg-stone-100 dark:bg-[#021c17] overflow-hidden">
                    <img
                      src={recipe.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600"}
                      alt={recipe.recipeName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="bg-emerald-600/95 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                        {recipe.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
                        recipe.difficultyLevel === "Easy"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-350"
                          : recipe.difficultyLevel === "Medium"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-350"
                          : "bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-350"
                      }`}>
                        {recipe.difficultyLevel || "Medium"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-lg text-stone-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-450 transition-colors">
                        {recipe.recipeName}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-xs font-semibold text-stone-500 dark:text-stone-400">
                        <span className="flex items-center gap-1.5">
                          <FaClock className="text-emerald-500" />
                          {recipe.preparationTime} Mins
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaUtensils className="text-emerald-500" />
                          {recipe.cuisineType}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 dark:border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={recipe.authorImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(recipe.authorEmail || 'chef')}`}
                          alt={recipe.authorName}
                          className="w-7 h-7 rounded-full border border-emerald-500 object-cover"
                          onError={(e) => {
                            e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(recipe.authorEmail || 'chef')}`;
                          }}
                        />
                        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 truncate max-w-[100px]">
                          {recipe.authorName || "Chef"}
                        </span>
                      </div>

                      <Link
                        href={`/browse-recipes/${recipe._id}`}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-3 border border-stone-200 dark:border-white/10 rounded-xl hover:bg-stone-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <FaChevronLeft className="text-xs" />
                </button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      page === pageNum
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                        : "border border-stone-200 dark:border-white/10 hover:bg-stone-100 dark:hover:bg-white/5 text-stone-600 dark:text-stone-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-3 border border-stone-200 dark:border-white/10 rounded-xl hover:bg-stone-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}