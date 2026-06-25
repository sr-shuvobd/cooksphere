"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaClock,
  FaUtensils,
  FaChevronLeft,
  FaEnvelope,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaRegStar,
  FaCheck,
  FaLock,
  FaFlag,
  FaTimes,
  FaLockOpen,
  FaShoppingBag,
  FaCreditCard,
} from "react-icons/fa";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function RecipeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const { data: session } = useSession();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [hasAccess, setHasAccess] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("BDT");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/29");
  const [cardCvc, setCardCvc] = useState("424");
  const [cardholderName, setCardholderName] = useState("");

  const fetchRecipeDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/recipes/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipe");
      }
      const data = await response.json();
      setRecipe(data);
      setLikesCount(data.likesCount || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const checkAccessAndStats = async () => {
    if (!id) return;
    try {
      await fetchRecipeDetails();

      if (session?.user?.email) {
        const accessRes = await fetch(
          `http://localhost:5000/recipes/${id}/purchase-status?email=${encodeURIComponent(
            session.user.email
          )}`
        );
        const accessData = await accessRes.json();
        setHasAccess(!!accessData.hasAccess);



        const favRes = await fetch(
          `http://localhost:5000/recipes/${id}/favorite-status?email=${encodeURIComponent(
            session.user.email
          )}`
        );
        const favData = await favRes.json();
        setIsFavorite(!!favData.isFavorite);

        const likeRes = await fetch(
          `http://localhost:5000/recipes/${id}/like-status?email=${encodeURIComponent(
            session.user.email
          )}`
        );
        const likeData = await likeRes.json();
        setIsLiked(!!likeData.isLiked);
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAccessAndStats();
    if (session?.user?.name) {
      setCardholderName(session.user.name);
    }
  }, [id, session]);

  const handleUnlock = () => {
    if (!session?.user?.email) {
      toast.error("Please login to unlock recipes!");
      router.push("/login");
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleConfirmPurchase = async () => {
    setPurchasing(true);
    const priceValue = selectedCurrency === "BDT" ? 638.17 : 4.99;
    try {
      const response = await fetch(`http://localhost:5000/recipes/${id}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: session.user.email,
          price: priceValue,
          currency: selectedCurrency
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Recipe unlocked successfully!");
        setIsCheckoutOpen(false);
        router.push(`/payment-success?type=recipe&id=${id}&amount=${data.price}&currency=${data.currency}&txnId=${data.txnId}`);
      } else {
        toast.error(data.message || "Failed to unlock recipe");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error unlocking recipe");
    } finally {
      setPurchasing(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!session?.user?.email) {
      toast.error("Please login to like recipes!");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/recipes/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsLiked(data.liked);
        setLikesCount((prev) => (data.liked ? prev + 1 : Math.max(0, prev - 1)));
        toast.success(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle like");
    }
  };

  const handleFavoriteToggle = async () => {
    if (!session?.user?.email) {
      toast.error("Please login to favorite recipes!");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/recipes/${id}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsFavorite(data.favorite);
        toast.success(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle favorite");
    }
  };

  const handleReport = async () => {
    if (!session?.user?.email) {
      toast.error("Please login to report recipes!");
      router.push("/login");
      return;
    }

    setReporting(true);
    try {
      const response = await fetch(`http://localhost:5000/recipes/${id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to report recipe");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error reporting recipe");
    } finally {
      setReporting(false);
    }
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-stone-50 dark:bg-[#021c17]">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-stone-500 dark:text-stone-400">Loading recipe details...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-stone-50 dark:bg-[#021c17] text-center px-4">
        <p className="text-5xl">🔍</p>
        <h2 className="text-2xl font-black text-stone-900 dark:text-white">Recipe Not Found</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm">
          The recipe details you are looking for could not be found or has been removed.
        </p>
        <button
          type="button"
          onClick={() => router.push("/browse-recipes")}
          className="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
        >
          Back to Browse Recipes
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#021c17] text-stone-900 dark:text-stone-100 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-450 transition-colors cursor-pointer bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 px-4 py-2.5 rounded-xl shadow-sm"
          >
            <FaChevronLeft className="text-[10px]" /> Back
          </button>


        </div>

        <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-stone-100 dark:shadow-none">
          <div className="relative h-64 sm:h-96 w-full bg-stone-100 dark:bg-[#021c17] overflow-hidden">
            <img
              src={recipe.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200"}
              alt={recipe.recipeName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="bg-emerald-600/95 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  {recipe.category}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                  recipe.difficultyLevel === "Easy"
                    ? "bg-emerald-100/95 text-emerald-900"
                    : recipe.difficultyLevel === "Medium"
                    ? "bg-amber-100/95 text-amber-900"
                    : "bg-red-100/95 text-red-900"
                }`}>
                  {recipe.difficultyLevel || "Medium"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight capitalize">
                {recipe.recipeName.replace(/-/g, " ")}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              
              <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-stone-50 dark:bg-[#021c17]/40 border border-stone-150 dark:border-white/5 text-sm font-bold text-stone-600 dark:text-stone-300">
                <div className="flex items-center gap-2">
                  <FaClock className="text-emerald-500 text-base" />
                  <span>Prep: {recipe.preparationTime} Mins</span>
                </div>
                <div className="flex items-center gap-2 border-l border-stone-200 dark:border-white/10 pl-6">
                  <FaUtensils className="text-emerald-500 text-base" />
                  <span>Cuisine: {recipe.cuisineType}</span>
                </div>
              </div>

              {!hasAccess ? (
                <div className="py-12 text-center space-y-6 bg-stone-50/50 dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-3xl p-6">
                  <div className="w-16 h-16 bg-amber-50 dark:bg-amber-955/20 rounded-full flex items-center justify-center text-amber-500 text-2xl mx-auto border border-amber-200 dark:border-amber-900/30 shadow-md">
                    <FaLock />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-black text-stone-900 dark:text-white">
                      Recipe details locked
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-bold max-w-md mx-auto leading-relaxed">
                      Viewing ingredients and instructions requires a one-time purchase. You can unlock it using the Purchase Details action in the right panel.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <h2 className="text-xl font-extrabold text-stone-900 dark:text-white">
                      Instructions
                    </h2>
                    <div className="space-y-4">
                      {recipe.instructions && recipe.instructions.length > 0 ? (
                        recipe.instructions.map((step, idx) => (
                          <div key={idx} className="flex gap-4">
                            <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-350 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed font-semibold">
                              {step}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-stone-500 dark:text-stone-400">No instructions specified.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-extrabold text-stone-900 dark:text-white">
                      Ingredients
                    </h2>
                    <div className="space-y-2">
                      {recipe.ingredients && recipe.ingredients.length > 0 ? (
                        recipe.ingredients.map((ingredient, idx) => {
                          const isChecked = !!checkedIngredients[idx];
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => toggleIngredient(idx)}
                              className="w-full flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-[#021c17]/30 border border-stone-150 dark:border-white/5 text-left transition-all hover:bg-stone-100/50 dark:hover:bg-white/5 cursor-pointer text-xs font-bold"
                            >
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all border ${
                                isChecked
                                  ? "bg-emerald-600 border-emerald-600 text-white"
                                  : "border-stone-300 dark:border-white/10"
                              }`}>
                                {isChecked && <FaCheck className="text-[10px]" />}
                              </span>
                              <span className={isChecked ? "line-through text-stone-400 dark:text-stone-500" : "text-stone-700 dark:text-stone-300"}>
                                {ingredient}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-sm text-stone-500 dark:text-stone-400">No ingredients listed.</p>
                      )}
                    </div>
                  </div>
                </>
              )}

            </div>

            <div className="space-y-6">
              
              <div className="bg-white dark:bg-[#03241f]/40 border border-stone-200 dark:border-white/10 rounded-3xl p-5 shadow-xl shadow-stone-100 dark:shadow-none space-y-4">
                <span className="text-[10px] font-black text-stone-400 dark:text-stone-550 uppercase tracking-widest block">
                  ACTIONS
                </span>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleLikeToggle}
                    className={`w-full py-3.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isLiked
                        ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/35 text-rose-600 dark:text-rose-400"
                        : "bg-white dark:bg-[#021c17]/40 border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5"
                    }`}
                  >
                    {isLiked ? <FaHeart /> : <FaRegHeart />}
                    Like ({likesCount})
                  </button>

                  <button
                    type="button"
                    onClick={handleFavoriteToggle}
                    className={`w-full py-3.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isFavorite
                        ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/35 text-amber-600 dark:text-amber-400"
                        : "bg-white dark:bg-[#021c17]/40 border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5"
                    }`}
                  >
                    {isFavorite ? <FaStar /> : <FaRegStar />}
                    {isFavorite ? "Saved to Favorites" : "Save to Favorites"}
                  </button>

                  <button
                    type="button"
                    onClick={handleUnlock}
                    disabled={hasAccess || purchasing}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer text-white ${
                      hasAccess
                        ? "bg-stone-400 dark:bg-stone-700 cursor-not-allowed"
                        : "bg-stone-900 dark:bg-stone-800 hover:bg-stone-850 dark:hover:bg-stone-700"
                    }`}
                  >
                    {purchasing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : hasAccess ? (
                      "Purchased"
                    ) : (
                      "Purchase Details"
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-stone-150 dark:border-white/5 flex justify-center">
                  <button
                    type="button"
                    onClick={handleReport}
                    disabled={reporting}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-500 dark:text-stone-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <FaFlag className="text-[10px]" />
                    {reporting ? "Reporting..." : "Report Issue"}
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-[#03241f]/40 border border-stone-200 dark:border-white/10 space-y-4">
                <h3 className="font-extrabold text-[10px] text-stone-450 dark:text-stone-550 uppercase tracking-widest">
                  Uploaded By
                </h3>
                <div className="flex items-center gap-3">
                  <img
                    src={recipe.authorImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(recipe.authorEmail || 'chef')}`}
                    alt={recipe.authorName}
                    className="w-12 h-12 rounded-full border border-emerald-500 object-cover"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(recipe.authorEmail || 'chef')}`;
                    }}
                  />
                  <div className="overflow-hidden">
                    <p className="text-sm font-extrabold text-stone-900 dark:text-white truncate">
                      {recipe.authorName || "Chef"}
                    </p>
                    <p className="text-xs text-stone-550 dark:text-stone-400 truncate flex items-center gap-1 font-semibold">
                      <FaEnvelope className="text-[10px] text-emerald-500" />
                      {recipe.authorEmail || "srs@gmail.com"}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#03241f] border border-stone-200 dark:border-white/10 rounded-[32px] max-w-4xl w-full p-6 md:p-8 shadow-2xl relative grid md:grid-cols-12 gap-8 my-8 text-stone-850 dark:text-white">
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-600 dark:hover:text-white transition-colors cursor-pointer z-10"
            >
              <FaTimes className="text-lg" />
            </button>

            {/* Left Column - Currency & Order Info */}
            <div className="md:col-span-5 space-y-6 pr-0 md:pr-4 md:border-r border-stone-150 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-450 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full inline-block">
                  Sandbox
                </span>
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                  Choose a currency:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency("BDT")}
                    className={`p-3 rounded-xl border-2 transition-all font-black text-xs cursor-pointer text-left flex flex-col gap-1 ${
                      selectedCurrency === "BDT"
                        ? "border-stone-900 bg-stone-50 text-stone-900 dark:border-white dark:bg-white/10 dark:text-white"
                        : "border-stone-200 text-stone-500 dark:border-white/10 hover:border-stone-400"
                    }`}
                  >
                    <span>🇧🇩 BDT 638.17</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency("USD")}
                    className={`p-3 rounded-xl border-2 transition-all font-black text-xs cursor-pointer text-left flex flex-col gap-1 ${
                      selectedCurrency === "USD"
                        ? "border-stone-900 bg-stone-50 text-stone-900 dark:border-white dark:bg-white/10 dark:text-white"
                        : "border-stone-200 text-stone-500 dark:border-white/10 hover:border-stone-400"
                    }`}
                  >
                    <span>🇺🇸 $4.99</span>
                  </button>
                </div>
                <span className="text-[10px] font-semibold text-stone-450 dark:text-stone-500 block">
                  1 USD = 127.8898 BDT
                </span>
              </div>

              <div className="border-t border-stone-150 dark:border-white/5 pt-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={recipe.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300"}
                      alt={recipe.recipeName}
                      className="w-14 h-14 object-cover rounded-2xl border border-stone-200 dark:border-white/10"
                    />
                    <div className="overflow-hidden">
                      <p className="text-sm font-black text-stone-900 dark:text-white truncate capitalize">
                        {recipe.recipeName.replace(/-/g, " ")}
                      </p>
                      <p className="text-xs text-stone-550 dark:text-stone-450 font-bold truncate">
                        Recipe by {recipe.authorName || "Sabbir Hossain"}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-sm text-stone-900 dark:text-white text-right whitespace-nowrap">
                    {selectedCurrency === "BDT" ? "BDT 638.17" : "$4.99"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Stripe Form */}
            <div className="md:col-span-7 space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Contact information
                </h4>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600 dark:text-stone-400">Email</label>
                  <input
                    type="email"
                    value={session?.user?.email || "a@gmail.com"}
                    disabled
                    className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50/50 dark:bg-white/5 text-xs text-stone-500 font-extrabold cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Payment method
                </h4>
                
                <div className="border border-stone-250 dark:border-white/10 rounded-2xl overflow-hidden bg-stone-50/20 dark:bg-white/5">
                  <div className="p-4 border-b border-stone-200 dark:border-white/5 flex items-center gap-2 bg-stone-50/40 dark:bg-white/5">
                    <FaCreditCard className="text-stone-600 dark:text-emerald-450 text-sm" />
                    <span className="text-xs font-black text-stone-850 dark:text-white">Card</span>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-600 dark:text-stone-400">Card information</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          className="w-full p-3.5 pr-12 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#021c17] text-xs font-extrabold outline-none focus:border-stone-500 dark:focus:border-emerald-500 transition-colors"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                          Visa
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-600 dark:text-stone-400">MM / YY</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM / YY"
                          className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#021c17] text-xs font-extrabold outline-none focus:border-stone-500 dark:focus:border-emerald-500 transition-colors text-center"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-600 dark:text-stone-400">CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#021c17] text-xs font-extrabold outline-none focus:border-stone-500 dark:focus:border-emerald-500 transition-colors text-center"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-600 dark:text-stone-400">Cardholder name</label>
                      <input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder="Full name on card"
                        className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#021c17] text-xs font-extrabold outline-none focus:border-stone-500 dark:focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-600 dark:text-stone-400">Country or region</label>
                      <select className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#021c17] text-xs font-extrabold outline-none focus:border-stone-500 dark:focus:border-emerald-500 transition-colors">
                        <option value="BD">Bangladesh</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="CA">Canada</option>
                      </select>
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 text-xs font-bold text-stone-550 dark:text-stone-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4.5 h-4.5 rounded border-stone-300 dark:border-white/15 text-emerald-650 focus:ring-emerald-500"
                  />
                  Save my information for faster checkout
                </label>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmPurchase}
                  disabled={purchasing}
                  className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-black text-sm rounded-2xl transition-all shadow-lg hover:shadow-sky-950/10 cursor-pointer flex items-center justify-center gap-2"
                >
                  {purchasing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Checkout...
                    </>
                  ) : (
                    `Pay ${selectedCurrency === "BDT" ? `BDT 638.17` : `$4.99`}`
                  )}
                </button>
                <div className="flex justify-center items-center gap-1.5 text-[10px] text-stone-400 font-bold">
                  <span>Powered by</span>
                  <span className="font-extrabold text-stone-500 dark:text-stone-300">stripe</span>
                  <span>|</span>
                  <span className="hover:underline cursor-pointer">Terms</span>
                  <span>|</span>
                  <span className="hover:underline cursor-pointer">Privacy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
