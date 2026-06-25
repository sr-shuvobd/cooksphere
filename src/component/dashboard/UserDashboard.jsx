"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  FaCreditCard,
  FaEnvelope
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
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [dbUser, setDbUser] = useState(null);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("BDT");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/29");
  const [cardCvc, setCardCvc] = useState("424");
  const [cardholderName, setCardholderName] = useState("");
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setCardholderName(session.user.name);
    }
    const fetchDbUser = async () => {
      if (!session?.user?.email) return;
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
  }, [session]);

  const handleUpgradeConfirm = async () => {
    setPurchasing(true);
    const priceValue = selectedCurrency === "BDT" ? 2556.50 : 19.99;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/users/${encodeURIComponent(session.user.email)}/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          price: priceValue,
          currency: selectedCurrency
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Successfully upgraded to Premium plan!");
        setIsUpgradeOpen(false);
        router.push(`/payment-success?type=premium&amount=${data.price}&currency=${data.currency}&txnId=${data.txnId}`);
      } else {
        toast.error(data.message || "Failed to upgrade");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error processing upgrade payment");
    } finally {
      setPurchasing(false);
    }
  };

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

  const isPremium = dbUser
    ? (dbUser.role === "premium" || dbUser.plan === "premium" || dbUser.role === "admin")
    : (session?.user?.role === "premium" || session?.user?.plan === "premium" || session?.user?.role === "admin");

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

            <button
              onClick={() => setIsUpgradeOpen(true)}
              className="mt-4 w-full bg-white text-orange-600 font-bold py-2 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            >
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

      {isUpgradeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#03201b] border border-stone-200 dark:border-white/10 rounded-[32px] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative text-stone-800 dark:text-stone-100">
            <button
              onClick={() => setIsUpgradeOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-stone-100 dark:hover:bg-white/5 z-10"
            >
              <FaTimes className="text-lg" />
            </button>

            <div className="md:w-1/2 bg-stone-50 dark:bg-[#021815] p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200 dark:border-white/5">
              <div className="space-y-6">
                <div>
                  <span className="bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-350 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full inline-block">
                    👑 Premium Access
                  </span>
                  <h3 className="text-2xl font-black text-stone-900 dark:text-white mt-3">
                    Premium Membership Upgrade
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-semibold">
                    Unlock all recipes and upload unlimited Chef masterworks.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-center gap-3 text-xs font-bold text-stone-600 dark:text-stone-300">
                    <span className="text-emerald-500 text-base">✓</span>
                    <span>Unlimited Recipe Submissions (Bypass the 2-slot limit)</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-stone-600 dark:text-stone-300">
                    <span className="text-emerald-500 text-base">✓</span>
                    <span>Full Access to All Locked & Premium Recipes</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-stone-600 dark:text-stone-300">
                    <span className="text-emerald-500 text-base">✓</span>
                    <span>Golden Chef Profile Badge (Premium Badge)</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-450 dark:text-stone-550">
                    Choose Currency
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCurrency("USD")}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                        selectedCurrency === "USD"
                          ? "bg-stone-900 text-white dark:bg-emerald-650"
                          : "bg-stone-200/50 hover:bg-stone-200 text-stone-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-stone-300"
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCurrency("BDT")}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                        selectedCurrency === "BDT"
                          ? "bg-stone-900 text-white dark:bg-emerald-650"
                          : "bg-stone-200/50 hover:bg-stone-200 text-stone-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-stone-300"
                      }`}
                    >
                      BDT (৳)
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-stone-200 dark:border-white/5 mt-6 md:mt-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-stone-500 dark:text-stone-400">Total Price:</span>
                  <span className="text-3xl font-black text-stone-900 dark:text-white">
                    {selectedCurrency === "BDT" ? "৳2,556.50 BDT" : "$19.99 USD"}
                  </span>
                </div>
                {selectedCurrency === "BDT" && (
                  <p className="text-[10px] text-stone-400 mt-1 font-semibold">
                    Converted from $19.99 USD at rate of 127.8898 BDT/USD.
                  </p>
                )}
              </div>
            </div>

            <div className="md:w-1/2 p-8 space-y-6 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-stone-850 dark:text-white uppercase tracking-wider mb-5">
                  Secure Checkout by Stripe
                </h4>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-450 dark:text-stone-550">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                      <input
                        type="email"
                        disabled
                        value={session?.user?.email || "srs@gmail.com"}
                        className="w-full bg-stone-100 dark:bg-[#021815] border border-stone-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-stone-500 dark:text-stone-400 cursor-not-allowed focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-450 dark:text-stone-550">
                      Card Details
                    </label>
                    <div className="relative">
                      <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number"
                        className="w-full bg-stone-50 dark:bg-[#021815] border border-stone-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-stone-850 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-1/2 space-y-1">
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM / YY"
                          className="w-full bg-stone-50 dark:bg-[#021815] border border-stone-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-stone-850 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div className="w-1/2 space-y-1">
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          className="w-full bg-stone-50 dark:bg-[#021815] border border-stone-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-stone-850 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-450 dark:text-stone-550">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="Name on Card"
                      className="w-full bg-stone-50 dark:bg-[#021815] border border-stone-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-stone-855 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-450 dark:text-stone-550">
                      Country or Region
                    </label>
                    <select
                      className="w-full bg-stone-50 dark:bg-[#021815] border border-stone-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-stone-855 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      defaultValue="Bangladesh"
                    >
                      <option>Bangladesh</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 pt-4">
                <button
                  type="button"
                  onClick={handleUpgradeConfirm}
                  disabled={purchasing}
                  className="w-full bg-stone-900 dark:bg-emerald-650 hover:bg-stone-850 dark:hover:bg-emerald-600 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {purchasing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ${selectedCurrency === "BDT" ? "৳2,556.50 BDT" : "$19.99 USD"}`
                  )}
                </button>
                <p className="text-[10px] text-center text-stone-400 font-semibold leading-relaxed">
                  🔒 Encrypted Connection. This is a simulated checkout environment using Stripe Sandbox keys.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;