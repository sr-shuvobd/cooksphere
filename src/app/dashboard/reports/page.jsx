"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminDashboard from "@/component/dashboard/AdminDashboard";
import { toast } from "react-toastify";
import { FaTrash, FaCheck, FaExclamationTriangle, FaRegCalendarAlt, FaUser, FaBookOpen } from "react-icons/fa";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(null);

  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/reports");
      const data = await response.json();
      if (data) {
        setReports(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDismissReport = async (reportId) => {
    setActioning(reportId);
    try {
      const response = await fetch(`http://localhost:5000/admin/reports/${reportId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Report dismissed successfully");
        fetchReports();
      } else {
        toast.error(data.message || "Failed to dismiss report");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error dismissing report");
    } finally {
      setActioning(null);
    }
  };

  const handleDeleteRecipe = async (recipeId, reportId) => {
    if (!confirm("Are you sure you want to delete this recipe? This action is irreversible.")) {
      return;
    }
    setActioning(reportId);
    try {
      // 1. Delete recipe
      const recipeResponse = await fetch(`http://localhost:5000/recipes/${recipeId}`, {
        method: "DELETE",
      });
      
      // 2. Dismiss report
      await fetch(`http://localhost:5000/admin/reports/${reportId}`, {
        method: "DELETE",
      });

      toast.success("Recipe deleted and report resolved");
      fetchReports();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting recipe");
    } finally {
      setActioning(null);
    }
  };

  return (
    <AdminDashboard>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-stone-850 dark:text-white">
            Reports & Flags
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            Review and take actions on recipes reported by users.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#03241f]/20 border border-stone-250 dark:border-white/5 rounded-3xl">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-stone-500 dark:text-stone-400">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="py-20 text-center space-y-5 bg-white dark:bg-[#03241f]/10 border border-stone-200 dark:border-white/5 rounded-3xl">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto text-2xl">
              <FaCheck />
            </div>
            <h3 className="text-xl font-bold text-stone-850 dark:text-white">All Clear!</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
              No reported recipes or issues flags found on the platform.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#03241f]/30 border border-stone-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl shadow-stone-100 dark:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-stone-150 dark:border-white/5 text-stone-400 dark:text-stone-500 font-bold bg-stone-50/50 dark:bg-white/5">
                    <th className="py-4 px-6">Reported Recipe</th>
                    <th className="py-4 px-6">Reported By</th>
                    <th className="py-4 px-6">Author Email</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-white/5 font-semibold text-stone-750 dark:text-stone-200">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-stone-50/40 dark:hover:bg-white/5 transition-all">
                      <td className="py-4 px-6 font-extrabold text-stone-900 dark:text-white">
                        <Link
                          href={`/browse-recipes/${report.recipeId}`}
                          className="flex items-center gap-2 hover:text-emerald-600 transition-colors"
                        >
                          <FaBookOpen className="text-stone-400 text-xs flex-shrink-0" />
                          <span className="truncate max-w-[200px]">{report.recipeName || "Recipe Details"}</span>
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-stone-600 dark:text-stone-300">
                        <span className="flex items-center gap-1.5">
                          <FaUser className="text-stone-400 text-xs" /> {report.userEmail}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-stone-500 dark:text-stone-400 text-xs">
                        {report.authorEmail || "N/A"}
                      </td>
                      <td className="py-4 px-6 text-xs text-stone-500 dark:text-stone-400">
                        <span className="flex items-center gap-1.5">
                          <FaRegCalendarAlt className="text-emerald-500" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={actioning !== null}
                            onClick={() => handleDismissReport(report._id)}
                            className="px-3 py-2 rounded-xl text-xs font-extrabold bg-stone-100 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 dark:hover:text-emerald-450 transition-all cursor-pointer border border-transparent"
                          >
                            Dismiss
                          </button>

                          <button
                            type="button"
                            disabled={actioning !== null}
                            onClick={() => handleDeleteRecipe(report.recipeId, report._id)}
                            className="px-3 py-2 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-500 text-white transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                          >
                            <FaTrash className="text-[10px]" /> Delete Recipe
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminDashboard>
  );
}
