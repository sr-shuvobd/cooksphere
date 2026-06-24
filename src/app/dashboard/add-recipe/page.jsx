"use client";

import { useState } from "react";
import UserDashboard from "@/component/dashboard/UserDashboard";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUtensils,
  FaClock,
  FaListUl,
  FaImage,
  FaPlus,
  FaTrashAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaFire,
  FaChevronRight,
} from "react-icons/fa";

export default function AddRecipePage() {
  const { data: session } = useSession();
  const isPremium = session?.user?.role === "premium" || session?.user?.plan === "premium";

  // Form states
  const [recipeName, setRecipeName] = useState("");
  const [category, setCategory] = useState("Pasta");
  const [cuisineType, setCuisineType] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("Medium");
  const [preparationTime, setPreparationTime] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);

  // Image Upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form submission / validation states
  const [submitting, setSubmitting] = useState(false);

  // Categories list matching standard recipe styles
  const categories = [
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

  // Handle dynamic ingredients
  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    } else {
      setIngredients([""]);
    }
  };

  // Handle dynamic instructions
  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const removeInstruction = (index) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    } else {
      setInstructions([""]);
    }
  };

  // Handle image drag and drop & selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Simulate imgbb uploading animation for better UX
      setUploading(true);
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            toast.success("Image uploaded successfully (Mock ImgBB)!");
            return 100;
          }
          return prev + 20;
        });
      }, 150);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!recipeName.trim()) return toast.error("Recipe Name is required!");
    if (!cuisineType.trim()) return toast.error("Cuisine Type is required!");
    if (!preparationTime || preparationTime <= 0) return toast.error("Please enter a valid preparation time!");
    if (ingredients.some(ing => !ing.trim())) return toast.error("Please fill in all ingredient fields!");
    if (instructions.some(ins => !ins.trim())) return toast.error("Please fill in all instruction steps!");
    if (!imagePreview) return toast.error("Please upload a recipe image!");

    setSubmitting(true);

    // Simulate successful form submittal
    setTimeout(() => {
      setSubmitting(false);

      toast.success("Recipe submitted successfully! (Mocked)");

      // Reset form
      setRecipeName("");
      setCategory("Pasta");
      setCuisineType("");
      setDifficultyLevel("Medium");
      setPreparationTime("");
      setIngredients([""]);
      setInstructions([""]);
      setImageFile(null);
      setImagePreview("");
      setUploadProgress(0);
    }, 1500);
  };

  return (
    <UserDashboard>
      <div className="max-w-7xl mx-auto pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight flex items-center gap-3">
              <FaUtensils className="text-emerald-600 dark:text-emerald-400" />
              Add New Recipe
            </h1>
            <p className="text-stone-500 dark:text-stone-300 mt-2">
              Share your culinary masterpiece with the CookSphere community.
            </p>
          </div>

          {/* Premium/Free Recipe Limit Banner */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-4 flex items-center gap-4 max-w-md shadow-sm">
            <div className="p-3 bg-emerald-500 text-white rounded-xl">
              <FaFire className="text-xl animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-850 dark:text-stone-200">
                  {isPremium ? "Premium Access" : "Free Account Limit"}
                </span>
                <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${isPremium ? "bg-amber-500 text-stone-900" : "bg-stone-500 text-white"}`}>
                  {isPremium ? "Unlimited" : "2 Slots"}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                {isPremium
                  ? "Enjoy unlimited recipe creation! Share as many as you wish."
                  : "You've used 1 of 2 recipe slots. Upgrade to Premium for unlimited publishing."}
              </p>
            </div>
          </div>
        </div>

        {/* Form and Preview Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Main Form (Col Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-xl shadow-stone-100 dark:shadow-none space-y-8 backdrop-blur-md">

              {/* Section 1: Basic Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-stone-100 dark:border-white/10 pb-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-sm font-bold">1</span>
                  <h2 className="text-xl font-bold text-stone-850 dark:text-stone-200">Recipe Basics</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recipe Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-stone-750 dark:text-stone-300">Recipe Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Garlic Butter Roast Salmon"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                      className="bg-stone-50 dark:bg-[#021c17] border border-stone-200 dark:border-white/15 rounded-xl px-4 py-3 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-stone-750 dark:text-stone-300">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="bg-stone-50 dark:bg-[#021c17] border border-stone-200 dark:border-white/15 rounded-xl px-4 py-3 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="dark:bg-[#03241f] text-stone-900 dark:text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cuisine Type */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-stone-750 dark:text-stone-300">Cuisine Type *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Italian, Japanese, Indian"
                      value={cuisineType}
                      onChange={(e) => setCuisineType(e.target.value)}
                      className="bg-stone-50 dark:bg-[#021c17] border border-stone-200 dark:border-white/15 rounded-xl px-4 py-3 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Prep Time */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-stone-750 dark:text-stone-300">Prep Time (minutes) *</label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="e.g. 45"
                        value={preparationTime}
                        onChange={(e) => setPreparationTime(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-[#021c17] border border-stone-200 dark:border-white/15 rounded-xl pl-4 pr-16 py-3 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 text-sm font-semibold">
                        mins
                      </span>
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-bold text-stone-750 dark:text-stone-300">Difficulty Level *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Easy", "Medium", "Hard"].map((level) => {
                        const isSelected = difficultyLevel === level;
                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setDifficultyLevel(level)}
                            className={`py-3 rounded-xl border text-sm font-bold transition-all duration-200 cursor-pointer ${isSelected
                                ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/10"
                                : "bg-stone-50 dark:bg-[#021c17] border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:border-emerald-500/50"
                              }`}
                          >
                            {level}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Media */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-stone-100 dark:border-white/10 pb-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-sm font-bold">2</span>
                  <h2 className="text-xl font-bold text-stone-850 dark:text-stone-200">Recipe Image</h2>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-stone-750 dark:text-stone-300">Upload Image (ImgBB Simulation) *</label>

                  <div className="border-2 border-dashed border-stone-200 dark:border-white/15 rounded-3xl p-6 text-center hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors relative bg-stone-50/50 dark:bg-[#021c17]/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    {imagePreview ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-40 w-auto object-cover rounded-2xl border border-stone-200 dark:border-white/15 shadow-md"
                        />
                        {uploading ? (
                          <div className="mt-4 w-48 bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full transition-all duration-150"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageFile(null);
                              setImagePreview("");
                            }}
                            className="mt-3 text-red-500 hover:text-red-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer bg-red-50 dark:bg-red-950/20 px-3 py-1.5 rounded-full"
                          >
                            <FaTrashAlt /> Remove & Change
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-4">
                        <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 shadow-inner">
                          <FaImage className="text-2xl" />
                        </div>
                        <p className="font-bold text-stone-850 dark:text-stone-200 text-sm">
                          Drag & drop your recipe photo here, or <span className="text-emerald-500 underline">browse</span>
                        </p>
                        <p className="text-xs text-stone-400 dark:text-stone-500 mt-1.5">
                          Supports PNG, JPG, JPEG (Max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Ingredients */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-sm font-bold">3</span>
                    <h2 className="text-xl font-bold text-stone-850 dark:text-stone-200">Ingredients</h2>
                  </div>
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="flex items-center gap-1.5 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40 px-3 py-1.5 rounded-xl hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 transition-all cursor-pointer shadow-sm"
                  >
                    <FaPlus /> Add Ingredient
                  </button>
                </div>

                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {ingredients.map((ingredient, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-2 items-center"
                      >
                        <span className="text-xs font-bold text-stone-400 dark:text-stone-500 w-6">
                          {(index + 1).toString().padStart(2, "0")}
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 2 cloves garlic, finely minced"
                          value={ingredient}
                          onChange={(e) => handleIngredientChange(index, e.target.value)}
                          className="flex-1 bg-stone-50 dark:bg-[#021c17] border border-stone-200 dark:border-white/15 rounded-xl px-4 py-2.5 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="p-3 text-stone-400 hover:text-red-500 dark:text-stone-500 dark:hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                        >
                          <FaTrashAlt />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Section 4: Instructions */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-sm font-bold">4</span>
                    <h2 className="text-xl font-bold text-stone-850 dark:text-stone-200">Preparation Steps</h2>
                  </div>
                  <button
                    type="button"
                    onClick={addInstruction}
                    className="flex items-center gap-1.5 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40 px-3 py-1.5 rounded-xl hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 transition-all cursor-pointer shadow-sm"
                  >
                    <FaPlus /> Add Step
                  </button>
                </div>

                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {instructions.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-3 items-start"
                      >
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 dark:bg-[#021c17] text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30 text-xs font-black mt-2.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <textarea
                          required
                          rows="2"
                          placeholder="e.g. Sauté garlic and onions in butter over medium heat until fragrant..."
                          value={step}
                          onChange={(e) => handleInstructionChange(index, e.target.value)}
                          className="flex-1 bg-stone-50 dark:bg-[#021c17] border border-stone-200 dark:border-white/15 rounded-xl px-4 py-2.5 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeInstruction(index)}
                          className="p-3 text-stone-400 hover:text-red-500 dark:text-stone-500 dark:hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer mt-1"
                        >
                          <FaTrashAlt />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-emerald-700/15 dark:shadow-none hover:shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 text-base"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Recipe...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle /> Create & Share Recipe
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Live Card Preview (Col Span 1) */}
          <div className="lg:col-span-1 lg:sticky lg:top-8 space-y-6">
            <div className="flex items-center gap-2 mb-2 px-1">
              <FaInfoCircle className="text-stone-400 dark:text-stone-500" />
              <h3 className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Live Feed Preview
              </h3>
            </div>

            {/* Simulated Recipe Card */}
            <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl shadow-stone-100 dark:shadow-none backdrop-blur-md group">
              {/* Card Image */}
              <div className="relative h-56 w-full bg-stone-100 dark:bg-[#021c17] flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Recipe preview"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center text-stone-300 dark:text-stone-600 p-4">
                    <FaUtensils className="text-6xl mb-3 text-emerald-100 dark:text-emerald-950/40" />
                    <p className="text-xs font-semibold">Image Preview Area</p>
                  </div>
                )}

                {/* Badges on Image */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    {category || "Pasta"}
                  </span>
                  {cuisineType && (
                    <span className="bg-stone-900/80 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                      {cuisineType}
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${difficultyLevel === "Easy"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
                      : difficultyLevel === "Medium"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200"
                    }`}>
                    {difficultyLevel}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-extrabold text-xl text-stone-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {recipeName || "Tasty Recipe Title"}
                  </h4>
                  <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1.5">
                      <FaClock className="text-emerald-500" />
                      {preparationTime ? `${preparationTime} Mins` : "-- Mins"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaListUl className="text-emerald-500" />
                      {ingredients.filter(i => i.trim() !== "").length} Ingredients
                    </span>
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center justify-between border-t border-stone-100 dark:border-white/10 pt-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={session?.user?.image || "https://i.pravatar.cc/150"}
                      alt="Author"
                      className="w-8 h-8 rounded-full border-2 border-emerald-500 object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                        {session?.user?.name || "Shohanur Rahman"}
                      </p>
                      <p className="text-[10px] text-stone-450 dark:text-stone-400">
                        Recipe Author
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline cursor-pointer">
                    View <FaChevronRight className="text-[9px]" />
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Helper Tips */}
            <div className="bg-stone-50 dark:bg-[#03241f]/10 border border-stone-200/50 dark:border-white/5 rounded-3xl p-6 space-y-4">
              <h4 className="font-bold text-stone-850 dark:text-stone-200 text-sm">
                Pro Publishing Tips
              </h4>
              <ul className="text-xs text-stone-500 dark:text-stone-400 space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>Use high-quality bright, well-lit square photos for food presentation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>Break down ingredients clearly including exact measurements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>Write short, step-by-step paragraphs for instructions so they're easy to read on mobile.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </UserDashboard>
  );
}
