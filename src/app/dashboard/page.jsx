"use client";

import AdminDashboard from "@/component/dashboard/AdminDashboard";
import UserDashboard from "@/component/dashboard/UserDashboard";
import { useSession } from "@/lib/auth-client";

const Dashboard = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {session?.user?.email === "srs@gmail.com" ? (
        <AdminDashboard />
      ) : (
        <UserDashboard />
      )}
    </>
  );
};

export default Dashboard;