"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import UserDashboard from "@/component/dashboard/UserDashboard";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  FaClock,
  FaUtensils,
  FaTrashAlt,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
} from "react-icons/fa";

export default function MyRecipesPage() {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyRecipes = async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes?authorEmail=${encodeURIComponent(
          session.user.email
        )}&page=${page}&limit=5`
      );
      const data = await response.json();
      if (data) {
        setRecipes(data.recipes || []);
        setTotalPages(Math.ceil((data.total || 0) / 5) || 1);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, [session, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.deletedCount > 0) {
        toast.success("Recipe deleted successfully!");
        if (recipes.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchMyRecipes();
        }
      } else {
        toast.error("Failed to delete recipe");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting recipe");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <UserDashboard>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-stone-850 dark:text-white">
              My Recipes
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mt-1">
              View, manage, and delete recipes you have added to CookSphere.
            </p>
          </div>
          <Link
            href="/dashboard/add-recipe"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3.5 rounded-2xl transition-all cursor-pointer shadow-md self-start sm:self-auto"
          >
            <FaPlus /> Add New Recipe
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#03241f]/20 border border-stone-250 dark:border-white/5 rounded-3xl">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-stone-500 dark:text-stone-400">Loading your recipes...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="py-20 text-center space-y-5 bg-white dark:bg-[#03241f]/10 border border-stone-200 dark:border-white/5 rounded-3xl">
            <p className="text-5xl">🍲</p>
            <h3 className="text-xl font-bold text-stone-850 dark:text-white">No Recipes Found</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
              You have not created any recipes yet. Click the button above to share your first culinary creation!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl shadow-stone-100 dark:shadow-none">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-stone-150 dark:border-white/5 text-stone-400 dark:text-stone-500 font-bold bg-stone-50/50 dark:bg-white/5">
                      <th className="py-4 px-6">Recipe</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Cuisine</th>
                      <th className="py-4 px-6">Prep Time</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-white/5 font-semibold text-stone-750 dark:text-stone-200">
                    {recipes.map((recipe) => (
                      <tr key={recipe._id} className="hover:bg-stone-50/40 dark:hover:bg-white/5 transition-all">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={recipe.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=150"}
                              alt={recipe.recipeName}
                              className="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-white/10"
                            />
                            <span className="font-extrabold text-stone-900 dark:text-white max-w-[180px] truncate">
                              {recipe.recipeName}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-350 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                            {recipe.category}
                          </span>
                        </td>
                        <td className="py-4 px-6">{recipe.cuisineType}</td>
                        <td className="py-4 px-6 flex items-center gap-1.5 mt-4 text-xs">
                          <FaClock className="text-emerald-500" /> {recipe.preparationTime} mins
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/browse-recipes/${recipe._id}`}
                              className="p-2.5 bg-stone-100 dark:bg-white/5 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-stone-600 dark:text-stone-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                              title="View Details"
                            >
                              <FaEye className="text-sm" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(recipe._id)}
                              disabled={deletingId === recipe._id}
                              className="p-2.5 bg-stone-100 dark:bg-white/5 hover:bg-red-600 text-stone-600 dark:text-stone-300 hover:text-white rounded-xl transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center"
                              title="Delete Recipe"
                            >
                              <FaTrashAlt className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
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
    </UserDashboard>
  );
}
