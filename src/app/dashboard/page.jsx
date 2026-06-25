"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminDashboard from "@/component/dashboard/AdminDashboard";
import UserDashboard from "@/component/dashboard/UserDashboard";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  FaUtensils,
  FaUsers,
  FaHeart,
  FaCrown,
  FaPlus,
  FaBookOpen,
  FaUser,
  FaChevronRight,
  FaClock,
  FaCoins,
} from "react-icons/fa";

function UserOverview({ session }) {
  const [recipesCount, setRecipesCount] = useState(0);
  const [latestRecipes, setLatestRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCoins, setUserCoins] = useState(50);
  const [buyingPackage, setBuyingPackage] = useState(null);

  const fetchUserStats = async () => {
    if (!session?.user?.email) return;
    try {
      const response = await fetch(
        `http://localhost:5000/recipes?authorEmail=${encodeURIComponent(
          session.user.email
        )}&limit=4`
      );
      const data = await response.json();
      if (data) {
        setRecipesCount(data.total || 0);
        setLatestRecipes(data.recipes || []);
      }

      const userRes = await fetch(
        `http://localhost:5000/users/${encodeURIComponent(session.user.email)}`
      );
      const userData = await userRes.json();
      if (userData) {
        setUserCoins(userData.coins !== undefined ? userData.coins : 50);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, [session]);

  const handleBuyCoins = async (coins, price) => {
    if (!session?.user?.email) return;
    setBuyingPackage(coins);
    const txnId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    try {
      const response = await fetch(
        `http://localhost:5000/users/${encodeURIComponent(session.user.email)}/buy-coins`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coins, price, transactionId: txnId }),
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success(`Successfully purchased ${coins} coins!`);
        fetchUserStats();
      } else {
        toast.error(data.message || "Failed to buy coins");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error during transaction");
    } finally {
      setBuyingPackage(null);
    }
  };

  const isPremium = session?.user?.role === "premium" || session?.user?.plan === "premium";

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            Chef Dashboard
          </span>
          <h2 className="text-3xl md:text-4xl font-black">
            Welcome Back, {session?.user?.name || "Chef"}!
          </h2>
          <p className="text-emerald-100 max-w-xl text-sm font-medium">
            Ready to share another culinary masterpiece with the world? Check your stats and manage your recipes below.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 hidden md:block">
          <FaUtensils className="w-full h-full p-8" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-stone-100 dark:shadow-none flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-450 text-2xl flex-shrink-0">
            <FaBookOpen />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              My Recipes
            </p>
            <h3 className="text-2xl font-black text-stone-900 dark:text-white mt-1">
              {recipesCount}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-stone-100 dark:shadow-none flex items-center gap-5">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-955/20 rounded-2xl flex items-center justify-center text-amber-550 text-2xl flex-shrink-0">
            <FaCoins />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              Coins Balance
            </p>
            <h3 className="text-2xl font-black text-stone-900 dark:text-white mt-1">
              {userCoins}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-stone-100 dark:shadow-none flex items-center gap-5">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-955/20 rounded-2xl flex items-center justify-center text-amber-500 text-2xl flex-shrink-0">
            <FaCrown />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              Membership
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm font-black uppercase tracking-wider px-3 py-0.5 rounded-full ${
                isPremium 
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-350"
                  : "bg-stone-100 text-stone-755 dark:bg-white/5 dark:text-stone-300"
              }`}>
                {isPremium ? "Premium" : "Free"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-stone-100 dark:shadow-none">
          <p className="text-xs font-bold text-stone-450 dark:text-stone-500 uppercase tracking-wider mb-2.5">
            Recipe Limit
          </p>
          {isPremium ? (
            <div className="space-y-1.5">
              <div className="h-2 w-full bg-emerald-650/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full w-full" />
              </div>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-450">
                Unlimited Uploads Unlocked
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="h-2 w-full bg-stone-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full bg-emerald-600 rounded-full ${recipesCount >= 2 ? "w-full" : recipesCount === 1 ? "w-1/2" : "w-0"}`} />
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-stone-500 dark:text-stone-400">{recipesCount} / 2 Created</span>
                {recipesCount >= 2 && <span className="text-rose-500">Limit Reached</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xl text-stone-900 dark:text-white">
              My Latest Recipes
            </h3>
            {recipesCount > 0 && (
              <Link 
                href="/dashboard/my-recipes"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1"
              >
                View All <FaChevronRight />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 bg-white dark:bg-[#03241f]/20 border border-stone-200 dark:border-white/5 rounded-3xl">
              <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-stone-400">Loading recipes...</p>
            </div>
          ) : latestRecipes.length === 0 ? (
            <div className="py-16 text-center space-y-4 bg-white dark:bg-[#03241f]/10 border border-stone-250 dark:border-white/5 rounded-3xl">
              <p className="text-4xl">🍳</p>
              <h4 className="font-bold text-stone-850 dark:text-white">No Recipes Created Yet</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                Share your first recipe and showcase your culinary skills to the world!
              </p>
              <Link
                href="/dashboard/add-recipe"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md"
              >
                <FaPlus /> Add Your First Recipe
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {latestRecipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="bg-white dark:bg-[#03241f]/35 border border-stone-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-md flex flex-col h-full group"
                >
                  <div className="relative h-32 w-full bg-stone-100 dark:bg-[#021c17]">
                    <img
                      src={recipe.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600"}
                      alt={recipe.recipeName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                    <span className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {recipe.category}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white truncate">
                      {recipe.recipeName}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                      <span className="flex items-center gap-1 font-semibold">
                        <FaClock /> {recipe.preparationTime} min
                      </span>
                      <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-350 px-2 py-0.5 rounded text-[10px] font-bold">
                        {recipe.cuisineType}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-extrabold text-xl text-stone-900 dark:text-white">
              Buy Coins Store
            </h3>
            <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-stone-100 dark:shadow-none space-y-4">
              <button
                type="button"
                onClick={() => handleBuyCoins(100, 1)}
                disabled={buyingPackage !== null}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-[#021c17] hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-stone-100 dark:border-white/5 transition-all text-xs font-extrabold text-stone-850 dark:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FaCoins className="text-amber-500" /> 100 Coins Package
                </span>
                <span className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-black">
                  $1.00
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleBuyCoins(500, 5)}
                disabled={buyingPackage !== null}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-[#021c17] hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-stone-100 dark:border-white/5 transition-all text-xs font-extrabold text-stone-850 dark:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FaCoins className="text-amber-500 animate-pulse" /> 500 Coins Package
                </span>
                <span className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-black">
                  $5.00
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleBuyCoins(1000, 10)}
                disabled={buyingPackage !== null}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-[#021c17] hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-stone-100 dark:border-white/5 transition-all text-xs font-extrabold text-stone-850 dark:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FaCoins className="text-amber-500" /> 1000 Coins Package
                </span>
                <span className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-black">
                  $10.00
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-extrabold text-xl text-stone-900 dark:text-white">
              Quick Actions
            </h3>

            <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-stone-100 dark:shadow-none space-y-3">
              <Link
                href="/dashboard/add-recipe"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-[#021c17] hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-stone-100 dark:border-white/5 transition-all text-sm font-extrabold text-stone-800 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-450"
              >
                <span className="flex items-center gap-3">
                  <FaPlus className="text-emerald-600" /> Add Recipe
                </span>
                <FaChevronRight className="text-xs text-stone-400" />
              </Link>

              <Link
                href="/browse-recipes"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-[#021c17] hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-stone-100 dark:border-white/5 transition-all text-sm font-extrabold text-stone-800 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-450"
              >
                <span className="flex items-center gap-3">
                  <FaUtensils className="text-emerald-600" /> Browse Recipes
                </span>
                <FaChevronRight className="text-xs text-stone-400" />
              </Link>

              <Link
                href="/dashboard/profile"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-[#021c17] hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-stone-100 dark:border-white/5 transition-all text-sm font-extrabold text-stone-800 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-450"
              >
                <span className="flex items-center gap-3">
                  <FaUser className="text-emerald-600" /> Edit Profile
                </span>
                <FaChevronRight className="text-xs text-stone-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminOverview() {
  const [stats, setStats] = useState({ totalRecipes: 0, totalUsers: 0 });
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsRes = await fetch("http://localhost:5000/admin/stats");
        const statsData = await statsRes.json();
        if (statsData) {
          setStats({
            totalRecipes: statsData.totalRecipes || 0,
            totalUsers: statsData.totalUsers || 0,
          });
        }

        const recipesRes = await fetch("http://localhost:5000/recipes?limit=5");
        const recipesData = await recipesRes.json();
        if (recipesData) {
          setRecentRecipes(recipesData.recipes || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-stone-850 dark:text-white">
          System Overview
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">
          Monitor the recipes collection, registered users, and active site logs.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-stone-100 dark:shadow-none flex items-center gap-5">
          <div className="w-14 h-14 bg-red-50 dark:bg-red-950/20 rounded-2xl flex items-center justify-center text-red-650 dark:text-red-400 text-2xl flex-shrink-0">
            <FaUtensils />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              Total Recipes
            </p>
            <h3 className="text-2xl font-black text-stone-900 dark:text-white mt-1">
              {stats.totalRecipes}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-stone-100 dark:shadow-none flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-450 text-2xl flex-shrink-0">
            <FaUsers />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              Registered Users
            </p>
            <h3 className="text-2xl font-black text-stone-900 dark:text-white mt-1">
              {stats.totalUsers}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-stone-100 dark:shadow-none flex items-center gap-5 sm:col-span-2 lg:col-span-1">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/30 rounded-2xl flex items-center justify-center text-blue-500 text-2xl flex-shrink-0 animate-pulse">
            🌐
          </div>
          <div>
            <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              Server Status
            </p>
            <h3 className="text-sm font-black text-emerald-600 dark:text-emerald-450 mt-1.5 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              ONLINE & ACTIVE
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-stone-100 dark:shadow-none space-y-4">
        <h3 className="font-extrabold text-lg text-stone-900 dark:text-white">
          Recent Platform Submissions
        </h3>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-red-650 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-stone-450">Loading platform data...</p>
          </div>
        ) : recentRecipes.length === 0 ? (
          <p className="text-sm text-stone-500 dark:text-stone-400 py-6 text-center">
            No recipes uploaded to the platform yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-stone-100 dark:border-white/5 text-stone-400 dark:text-stone-500 font-bold">
                  <th className="py-3 px-4">Recipe Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Preparation Time</th>
                  <th className="py-3 px-4">Cuisine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-white/5 font-semibold text-stone-850 dark:text-stone-200">
                {recentRecipes.map((recipe) => (
                  <tr key={recipe._id} className="hover:bg-stone-50/50 dark:hover:bg-white/5 transition-all">
                    <td className="py-3.5 px-4 font-extrabold text-stone-900 dark:text-white">
                      {recipe.recipeName}
                    </td>
                    <td className="py-3.5 px-4">{recipe.category}</td>
                    <td className="py-3.5 px-4">{recipe.authorName || "Chef"}</td>
                    <td className="py-3.5 px-4">{recipe.preparationTime} mins</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-stone-100 dark:bg-white/5 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded text-xs">
                        {recipe.cuisineType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#021c17]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 dark:border-orange-450 border-t-transparent" />
      </div>
    );
  }

  const isAdmin = session?.user?.email === "srs@gmail.com";

  return (
    <>
      {isAdmin ? (
        <AdminDashboard>
          <AdminOverview />
        </AdminDashboard>
      ) : (
        <UserDashboard>
          <UserOverview session={session} />
        </UserDashboard>
      )}
    </>
  );
}