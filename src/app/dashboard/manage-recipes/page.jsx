"use client";

import { useState, useEffect } from "react";
import AdminDashboard from "@/component/dashboard/AdminDashboard";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { 
  FaSearch, 
  FaTrash, 
  FaStar, 
  FaBan, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaBookOpen,
  FaRedo
} from "react-icons/fa";

export default function ManageRecipesPage() {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);

  const limit = 10;

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/recipes?page=${page}&limit=${limit}`;
      if (search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (data) {
        setRecipes(data.recipes || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [page, category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRecipes();
  };

  const handleToggleFeature = async (recipeId, currentFeatured) => {
    setUpdatingId(recipeId);
    try {
      const response = await fetch(`http://localhost:5000/recipes/${recipeId}/feature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });
      if (response.ok) {
        toast.success(currentFeatured ? "Recipe unfeatured successfully!" : "Recipe featured successfully!");
        fetchRecipes();
      } else {
        toast.error("Failed to update featured status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating featured status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (recipeId, currentStatus) => {
    const newStatus = currentStatus === "suspended" ? "active" : "suspended";
    setUpdatingId(recipeId);
    try {
      const response = await fetch(`http://localhost:5000/recipes/${recipeId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        toast.success(`Recipe has been ${newStatus}!`);
        fetchRecipes();
      } else {
        toast.error("Failed to update recipe status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating recipe status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!confirm("Are you sure you want to delete this recipe permanently? This action cannot be undone.")) return;
    setUpdatingId(recipeId);
    try {
      const response = await fetch(`http://localhost:5000/recipes/${recipeId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Recipe deleted successfully!");
        fetchRecipes();
      } else {
        toast.error("Failed to delete recipe");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting recipe");
    } finally {
      setUpdatingId(null);
    }
  };

  const categoriesList = [
    "Pasta",
    "Soup",
    "Salad",
    "Dessert",
    "Drinks",
    "Healthy",
    "Main Course",
    "Breakfast",
    "Appetizer",
    "BBQ"
  ];

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminDashboard>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-stone-850 dark:text-white">
              Manage Recipes
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mt-1">
              Inspect user submissions, delete recipes, toggle featured list or suspend posts.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search recipe title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-6 rounded-2xl transition-all shadow-md cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setCategory(""); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              category === "" 
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:bg-stone-50"
            }`}
          >
            All Categories
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                category === cat
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:bg-stone-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#03241f]/20 border border-stone-250 dark:border-white/5 rounded-3xl">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-stone-500 dark:text-stone-400">Loading recipes...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="py-20 text-center space-y-5 bg-white dark:bg-[#03241f]/10 border border-stone-200 dark:border-white/5 rounded-3xl">
            <p className="text-5xl">🍳</p>
            <h3 className="text-xl font-bold text-stone-850 dark:text-white">No Recipes Found</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">Try adjusting your category or search query.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl shadow-stone-100 dark:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-stone-150 dark:border-white/5 text-stone-400 dark:text-stone-550 font-bold bg-stone-50/50 dark:bg-white/5">
                    <th className="py-4 px-6">Recipe</th>
                    <th className="py-4 px-6">Category & Cook Time</th>
                    <th className="py-4 px-6">Creator / Author</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-white/5 font-semibold text-stone-750 dark:text-stone-200">
                  {recipes.map((r) => {
                    const isSuspended = r.status === "suspended";
                    return (
                      <tr key={r._id} className="hover:bg-stone-50/40 dark:hover:bg-white/5 transition-all">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={r.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=150"}
                              alt={r.recipeName}
                              className="w-14 h-14 rounded-2xl object-cover border border-stone-200 dark:border-white/5 flex-shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-stone-900 dark:text-white">
                                  {r.recipeName}
                                </h4>
                                {r.isFeatured && (
                                  <span className="bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-350 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <FaStar className="text-[8px]" /> Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-stone-450 dark:text-stone-550 mt-0.5">
                                Likes: {r.likesCount || 0}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <span className="bg-stone-100 dark:bg-white/5 text-stone-700 dark:text-stone-300 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                              {r.category}
                            </span>
                            <p className="text-xs text-stone-450 dark:text-stone-550 flex items-center gap-1 mt-1">
                              <FaClock /> {r.preparationTime} mins
                            </p>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="space-y-0.5">
                            <p className="text-xs text-stone-800 dark:text-stone-100 truncate max-w-[200px]">
                              {r.authorName || "Anonymous Chef"}
                            </p>
                            <p className="text-[10px] text-stone-450 dark:text-stone-550 truncate max-w-[200px]">
                              {r.authorEmail}
                            </p>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                            isSuspended
                              ? "bg-red-50 text-red-750 dark:bg-red-955/20 dark:text-red-400"
                              : "bg-emerald-50 text-emerald-750 dark:bg-emerald-955/20 dark:text-emerald-400"
                          }`}>
                            {isSuspended ? (
                              <>
                                <FaTimesCircle /> Suspended
                              </>
                            ) : (
                              <>
                                <FaCheckCircle /> Active
                              </>
                            )}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              onClick={() => handleToggleFeature(r._id, r.isFeatured)}
                              disabled={updatingId !== null}
                              title={r.isFeatured ? "Unfeature Recipe" : "Feature Recipe"}
                              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                r.isFeatured
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20"
                                  : "border-stone-200 dark:border-white/10 text-stone-400 hover:bg-stone-50 hover:text-stone-600 dark:hover:bg-white/5 dark:hover:text-white"
                              }`}
                            >
                              <FaStar className="text-sm" />
                            </button>

                            <button
                              onClick={() => handleToggleStatus(r._id, r.status)}
                              disabled={updatingId !== null}
                              title={isSuspended ? "Activate Recipe" : "Suspend Recipe"}
                              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                isSuspended
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20"
                                  : "border-stone-200 dark:border-white/10 text-red-500 hover:bg-red-500/10 hover:border-red-500/30"
                              }`}
                            >
                              {isSuspended ? <FaRedo className="text-sm" /> : <FaBan className="text-sm" />}
                            </button>

                            <button
                              onClick={() => handleDeleteRecipe(r._id)}
                              disabled={updatingId !== null}
                              title="Delete Permanently"
                              className="p-2 rounded-xl border border-stone-200 dark:border-white/10 text-stone-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all cursor-pointer"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-stone-150 dark:border-white/5 bg-stone-50/50 dark:bg-white/5">
                <p className="text-xs font-bold text-stone-500 dark:text-stone-400">
                  Showing page <span className="text-stone-850 dark:text-white">{page}</span> of <span className="text-stone-850 dark:text-white">{totalPages}</span>
                </p>
                
                <div className="flex gap-2">
                  <button
                    disabled={page === 1 || loading}
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    className="px-4 py-2 border border-stone-200 dark:border-white/10 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page === totalPages || loading}
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    className="px-4 py-2 border border-stone-200 dark:border-white/10 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminDashboard>
  );
}
