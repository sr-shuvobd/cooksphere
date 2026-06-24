"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaChartBar,
  FaUsers,
  FaUtensils,
  FaFileAlt,
  FaCreditCard,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserShield,
} from "react-icons/fa";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const menuItems = [
  {
    name: "Overview",
    icon: <FaChartBar />,
    href: "/dashboard",
  },
  {
    name: "Manage Users",
    icon: <FaUsers />,
    href: "/dashboard/manage-users",
  },
  {
    name: "Manage Recipes",
    icon: <FaUtensils />,
    href: "/dashboard/manage-recipes",
  },
  {
    name: "Reports",
    icon: <FaFileAlt />,
    href: "/dashboard/reports",
  },
  {
    name: "Transactions",
    icon: <FaCreditCard />,
    href: "/dashboard/transactions",
  },
];

const AdminDashboard = ({ children }) => {
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-50 dark:bg-[#021c17] w-full">
      <div className="md:hidden flex items-center justify-between p-4 bg-[#03241f] text-white border-b border-white/10 w-full">
        <button onClick={() => setIsOpen(true)} className="text-xl p-2">
          <FaBars />
        </button>
        <span className="font-black text-lg">Admin Panel</span>
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
              src={session?.user?.image || "https://i.pravatar.cc/150"}
              alt="user"
              className="w-20 h-20 rounded-full border-4 border-red-500 object-cover"
            />

            <h3 className="mt-3 font-bold text-lg text-center truncate w-full px-2">
              {session?.user?.name || "Shohanur Rahman"}
            </h3>

            <p className="text-sm text-gray-300 text-center truncate w-full px-2">
              {session?.user?.email || "srs@gmail.com"}
            </p>

            <span className="mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-600 flex items-center gap-1">
              <FaUserShield className="text-xs" /> Admin
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
                  isActive ? "bg-red-700/60 font-bold" : "hover:bg-red-800/30"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

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
              Admin Overview
            </h1>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
