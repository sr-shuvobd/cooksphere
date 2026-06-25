"use client";

import { useState, useEffect } from "react";
import AdminDashboard from "@/component/dashboard/AdminDashboard";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaShieldAlt, FaUserEdit, FaCrown } from "react-icons/fa";

export default function ManageUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`);
      const data = await response.json();
      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleUpdate = async (email, newRole) => {
    setUpdatingUser(email);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${encodeURIComponent(email)}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success(`User role updated to ${newRole}`);
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to update role");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating user role");
    } finally {
      setUpdatingUser(null);
    }
  };

  return (
    <AdminDashboard>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-stone-850 dark:text-white">
            Manage Users
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            View, inspect, and update roles of all platform users.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#03241f]/20 border border-stone-250 dark:border-white/5 rounded-3xl">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-stone-500 dark:text-stone-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center space-y-5 bg-white dark:bg-[#03241f]/10 border border-stone-200 dark:border-white/5 rounded-3xl">
            <p className="text-5xl">👥</p>
            <h3 className="text-xl font-bold text-stone-850 dark:text-white">No Users Found</h3>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl shadow-stone-100 dark:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-stone-150 dark:border-white/5 text-stone-400 dark:text-stone-500 font-bold bg-stone-50/50 dark:bg-white/5">
                    <th className="py-4 px-6">User Info</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-white/5 font-semibold text-stone-750 dark:text-stone-200">
                  {users.map((u) => {
                    const avatarUrl = u.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(u.email || 'user')}`;
                    const isSelf = u.email === session?.user?.email;
                    return (
                      <tr key={u._id} className="hover:bg-stone-50/40 dark:hover:bg-white/5 transition-all">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={avatarUrl}
                              alt={u.name || "User"}
                              className="w-10 h-10 rounded-full border border-stone-200 dark:border-white/10 object-cover"
                              onError={(e) => {
                                e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(u.email || 'user')}`;
                              }}
                            />
                            <div>
                              <p className="font-extrabold text-stone-900 dark:text-white flex items-center gap-1.5">
                                {u.name || "Chef"}
                                {isSelf && (
                                  <span className="text-[9px] bg-stone-100 dark:bg-white/5 text-stone-400 px-2 py-0.5 rounded font-black">
                                    You
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-stone-600 dark:text-stone-300">
                          <span className="flex items-center gap-1.5">
                            <FaEnvelope className="text-stone-400" /> {u.email}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {u.role === "admin" ? (
                            <span className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1 shadow-sm">
                              <FaShieldAlt className="text-[10px]" /> Admin
                            </span>
                          ) : u.role === "premium" ? (
                            <span className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1 shadow-sm">
                              <FaCrown className="text-[10px]" /> Premium
                            </span>
                          ) : (
                            <span className="bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-300 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                              <FaUser className="text-[10px]" /> User
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {u.role !== "admin" && (
                              <button
                                type="button"
                                disabled={updatingUser !== null}
                                onClick={() => handleRoleUpdate(u.email, "admin")}
                                className="px-3 py-2 rounded-xl text-xs font-extrabold bg-stone-100 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-650 dark:hover:text-rose-400 transition-all cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900/35"
                              >
                                Make Admin
                              </button>
                            )}

                            {u.role === "premium" ? (
                              <button
                                type="button"
                                disabled={updatingUser !== null || isSelf}
                                onClick={() => handleRoleUpdate(u.email, "user")}
                                className="px-3 py-2 rounded-xl text-xs font-extrabold bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 hover:text-stone-850 dark:hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Demote to User
                              </button>
                            ) : (
                              u.role !== "admin" && (
                                <button
                                  type="button"
                                  disabled={updatingUser !== null}
                                  onClick={() => handleRoleUpdate(u.email, "premium")}
                                  className="px-3 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 text-white hover:bg-emerald-500 transition-all cursor-pointer shadow-md"
                                >
                                  Make Premium
                                </button>
                              )
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminDashboard>
  );
}
