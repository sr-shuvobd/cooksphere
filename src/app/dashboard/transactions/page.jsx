"use client";

import { useState, useEffect } from "react";
import AdminDashboard from "@/component/dashboard/AdminDashboard";
import UserDashboard from "@/component/dashboard/UserDashboard";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { FaReceipt, FaUser, FaRegCalendarAlt } from "react-icons/fa";

function TransactionsList({ isAdmin, email }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const url = isAdmin
          ? "http://localhost:5000/admin/transactions"
          : `http://localhost:5000/users/${encodeURIComponent(email)}/transactions`;
        const response = await fetch(url);
        const data = await response.json();
        if (data) {
          setTransactions(data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchTransactions();
    }
  }, [isAdmin, email]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#03241f]/20 border border-stone-250 dark:border-white/5 rounded-3xl">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-stone-500 dark:text-stone-400">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-stone-850 dark:text-white">
          Transactions History
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">
          {isAdmin
            ? "View and monitor all platform purchase transactions."
            : "Review your recipe purchase logs and billing history."}
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="py-20 text-center space-y-5 bg-white dark:bg-[#03241f]/10 border border-stone-200 dark:border-white/5 rounded-3xl">
          <p className="text-5xl">💳</p>
          <h3 className="text-xl font-bold text-stone-855 dark:text-white">No Transactions Yet</h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
            No transactions recorded on this account.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl shadow-stone-100 dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-stone-150 dark:border-white/5 text-stone-400 dark:text-stone-500 font-bold bg-stone-50/50 dark:bg-white/5">
                  {isAdmin && <th className="py-4 px-6">User Email</th>}
                  <th className="py-4 px-6">Description / Recipe</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Transaction ID</th>
                  <th className="py-4 px-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-white/5 font-semibold text-stone-750 dark:text-stone-200">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-stone-50/40 dark:hover:bg-white/5 transition-all">
                    {isAdmin && (
                      <td className="py-4 px-6 font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                        <FaUser className="text-emerald-500 text-xs" />
                        {tx.userEmail}
                      </td>
                    )}
                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1.5 text-stone-900 dark:text-white">
                        {tx.recipeName ? (
                          <span className="font-extrabold text-stone-850 dark:text-white">{tx.recipeName}</span>
                        ) : (
                          <span className="text-stone-500 font-semibold">{tx.coins ? `${tx.coins} Coins Package` : "Recipe Unlocked"}</span>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-350 px-2.5 py-1 rounded-full text-xs font-black">
                        {tx.currency === "BDT" ? "৳" : "$"}{tx.price.toFixed(2)} {tx.currency || "USD"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-stone-600 dark:text-stone-300 font-mono text-xs">
                      <span className="flex items-center gap-1.5">
                        <FaReceipt className="text-stone-400" /> {tx.transactionId}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-stone-500 dark:text-stone-400">
                      <span className="flex items-center gap-1.5">
                        <FaRegCalendarAlt className="text-emerald-500" />
                        {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TransactionsPage() {
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
          <TransactionsList isAdmin={true} email={session?.user?.email} />
        </AdminDashboard>
      ) : (
        <UserDashboard>
          <TransactionsList isAdmin={false} email={session?.user?.email} />
        </UserDashboard>
      )}
    </>
  );
}
