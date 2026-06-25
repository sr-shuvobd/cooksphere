"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import UserDashboard from "@/component/dashboard/UserDashboard";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { FaHeart, FaClock, FaUtensils, FaEye } from "react-icons/fa";

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/users/${encodeURIComponent(session.user.email)}/favorites`
      );
      const data = await response.json();
      if (data) {
        setRecipes(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load favorite recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [session]);

  const handleUnfavorite = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/recipes/${id}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        fetchFavorites();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove from favorites");
    }
  };

  return (
    <UserDashboard>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-stone-850 dark:text-white">
            My Favorites
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            Recipes you have saved to try and cook later.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#03241f]/20 border border-stone-250 dark:border-white/5 rounded-3xl">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-stone-500 dark:text-stone-400">Loading favorites...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="py-20 text-center space-y-5 bg-white dark:bg-[#03241f]/10 border border-stone-200 dark:border-white/5 rounded-3xl">
            <p className="text-5xl">❤️</p>
            <h3 className="text-xl font-bold text-stone-850 dark:text-white">No Favorites Yet</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
              Browse through our recipes and hit the heart icon on your favorite dishes to see them here!
            </p>
            <Link
              href="/browse-recipes"
              className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3.5 rounded-2xl transition-all cursor-pointer shadow-md"
            >
              Browse Recipes
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl shadow-stone-100/50 dark:shadow-none flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 w-full bg-stone-100 dark:bg-[#021c17]">
                    <img
                      src={recipe.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600"}
                      alt={recipe.recipeName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    <button
                      type="button"
                      onClick={() => handleUnfavorite(recipe._id)}
                      className="absolute top-4 right-4 p-3 bg-white dark:bg-stone-900 text-rose-600 rounded-full shadow-md cursor-pointer transition-transform hover:scale-110 flex items-center justify-center"
                      title="Remove from Favorites"
                    >
                      <FaHeart />
                    </button>
                    
                    <span className="absolute bottom-4 left-4 bg-emerald-600/90 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      {recipe.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-4">
                    <h3 className="text-lg font-black text-stone-900 dark:text-white capitalize truncate">
                      {recipe.recipeName.replace(/-/g, " ")}
                    </h3>

                    <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
                      <span className="flex items-center gap-1.5">
                        <FaClock className="text-emerald-500" /> {recipe.preparationTime} mins
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaUtensils className="text-emerald-500" /> {recipe.cuisineType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/browse-recipes/${recipe._id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-stone-100 dark:bg-white/5 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-stone-750 dark:text-stone-250 hover:text-white font-extrabold text-xs py-3 rounded-2xl transition-all cursor-pointer"
                  >
                    <FaEye /> View Recipe Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserDashboard>
  );
}
