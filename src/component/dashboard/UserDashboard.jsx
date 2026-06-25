"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaHome,
  FaPlus,
  FaBookOpen,
  FaHeart,
  FaShoppingBag,
  FaUser,
  FaCrown,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const menuItems = [
  {
    name: "Overview",
    icon: <FaHome />,
    href: "/dashboard",
  },
  {
    name: "Add Recipe",
    icon: <FaPlus />,
    href: "/dashboard/add-recipe",
  },
  {
    name: "My Recipes",
    icon: <FaBookOpen />,
    href: "/dashboard/my-recipes",
  },
  {
    name: "Favorites",
    icon: <FaHeart />,
    href: "/dashboard/favorites",
  },
  {
    name: "Purchased",
    icon: <FaShoppingBag />,
    href: "/dashboard/purchased",
  },
  {
    name: "Profile",
    icon: <FaUser />,
    href: "/dashboard/profile",
  },
];

const UserDashboard = ({ children }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Successfully logged out!");
            window.location.href = "/";
          }
        }
      });
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const isPremium = session?.user?.role === "premium" || session?.user?.plan === "premium";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-50 dark:bg-[#021c17] w-full">
      <div className="md:hidden flex items-center justify-between p-4 bg-[#03241f] text-white border-b border-white/10 w-full">
        <button onClick={() => setIsOpen(true)} className="text-xl p-2">
          <FaBars />
        </button>
        <span className="font-black text-lg">User Dashboard</span>
        <div className="w-10"></div>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/55 z-40 md:hidden transition-opacity duration-300"
        />
      )}

      <aside className={`w-72 min-h-screen bg-[#03241f] text-white border-r border-white/10 flex flex-col flex-shrink-0 transition-transform duration-300 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed md:static inset-y-0 left-0 z-50 md:z-auto`}>
        <div className="p-6 border-b border-white/10 relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-xl p-2 md:hidden hover:text-red-400"
          >
            <FaTimes />
          </button>
          
          <div className="flex flex-col items-center">
            <img
              src={session?.user?.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(session?.user?.email || 'chef')}`}
              alt="user"
              className="w-20 h-20 rounded-full border-4 border-orange-500 object-cover"
            />

            <h3 className="mt-3 font-bold text-lg text-center truncate w-full px-2">
              {session?.user?.name || "Shohanur Rahman"}
            </h3>

            <p className="text-sm text-gray-300 text-center truncate w-full px-2">
              {session?.user?.email || "srs@gmail.com"}
            </p>

            <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${isPremium ? "bg-amber-500" : "bg-orange-500"}`}>
              {isPremium ? "Premium Plan" : "Free Plan"}
            </span>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive ? "bg-emerald-700 font-bold" : "hover:bg-emerald-800/50"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {!isPremium && (
          <div className="m-4 p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500">
            <div className="flex items-center gap-2">
              <FaCrown />
              <h4 className="font-bold">
                Upgrade to Premium
              </h4>
            </div>

            <p className="text-sm mt-2 font-medium">
              Unlock unlimited recipe uploads and premium badge.
            </p>

            <button className="mt-4 w-full bg-white text-orange-600 font-bold py-2 rounded-xl hover:bg-stone-100 transition-colors">
              Upgrade Now
            </button>
          </div>
        )}

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 font-semibold w-full text-left"
          >
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>
      </aside>
      
      <main className="flex-grow p-8 overflow-y-auto">
        {children || (
          <div>
            <h1 className="text-3xl font-black text-stone-850 dark:text-white">
              Overview
            </h1>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;