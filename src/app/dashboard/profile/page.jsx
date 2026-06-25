"use client";

import { useState, useEffect } from "react";
import UserDashboard from "@/component/dashboard/UserDashboard";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaUpload,
  FaCheckCircle,
  FaCrown,
  FaEdit,
  FaCalendarAlt,
} from "react-icons/fa";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImageUrl(session.user.image || "");
      
      const fetchDbUser = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/users/${encodeURIComponent(session.user.email)}`);
          if (res.ok) {
            const data = await res.json();
            setDbUser(data);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchDbUser();
    }
  }, [session]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=4983d5f47f26efc3e85064efe6b1a73c",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      if (result.success && result.data?.url) {
        setImageUrl(result.data.url);
        toast.success("Profile image uploaded successfully!");
      } else {
        toast.error("Failed to upload image. Please try again.");
      }
    } catch (error) {
      toast.error("Error uploading image");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setUpdating(true);
    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: imageUrl,
      });

      if (error) {
        toast.error(error.message || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully!");
        window.location.reload();
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const isPremium = dbUser
    ? (dbUser.role === "premium" || dbUser.plan === "premium" || dbUser.role === "admin")
    : (session?.user?.role === "premium" || session?.user?.plan === "premium" || session?.user?.role === "admin");

  return (
    <UserDashboard>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-stone-850 dark:text-white">
            My Profile
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            Manage your account settings and profile information.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-stone-100 dark:shadow-none flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <img
                src={imageUrl || "https://i.pravatar.cc/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-emerald-600 dark:border-emerald-500 object-cover shadow-md"
              />
              <label className="absolute bottom-1 right-1 bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-full cursor-pointer shadow-lg transition-all flex items-center justify-center">
                <FaUpload className="text-xs" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="space-y-2 w-full">
              <h2 className="font-extrabold text-xl text-stone-900 dark:text-white truncate px-2">
                {session?.user?.name || "Shohanur Rahman"}
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 truncate px-2">
                {session?.user?.email}
              </p>
              <div className="flex justify-center pt-2">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  isPremium 
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-350 border border-amber-250 dark:border-amber-900/50" 
                    : "bg-stone-100 text-stone-700 dark:bg-white/5 dark:text-stone-300 border border-stone-200 dark:border-white/10"
                }`}>
                  {isPremium ? <FaCrown className="text-amber-500" /> : <FaUser />}
                  {isPremium ? "Premium member" : "Free account"}
                </span>
              </div>
            </div>

            {session?.user?.createdAt && (
              <div className="pt-4 border-t border-stone-150 dark:border-white/5 w-full flex items-center justify-center gap-2 text-xs font-bold text-stone-450 dark:text-stone-400">
                <FaCalendarAlt />
                <span>Joined {new Date(session.user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2 bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl p-8 shadow-xl shadow-stone-100 dark:shadow-none">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-6 flex items-center gap-2">
              <FaEdit className="text-emerald-600 dark:text-emerald-500" /> Update Account Details
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-stone-50 dark:bg-[#021c17] border border-stone-200 dark:border-white/15 rounded-2xl pl-12 pr-4 py-3.5 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    value={session?.user?.email || ""}
                    disabled
                    className="w-full bg-stone-100 dark:bg-[#021c17]/60 border border-stone-200 dark:border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-stone-450 dark:text-stone-500 cursor-not-allowed text-sm font-medium"
                  />
                </div>
                <p className="text-[11px] font-semibold text-stone-400 dark:text-stone-500">
                  Your email address is managed by authentication provider and cannot be changed.
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-2xl transition-all cursor-pointer shadow-md hover:shadow-emerald-600/10 flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </UserDashboard>
  );
}
