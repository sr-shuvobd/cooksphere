import UserDashboard from "@/component/dashboard/UserDashboard";

export default function ProfilePage() {
  return (
    <UserDashboard>
      <div>
        <h1 className="text-3xl font-black text-stone-850 dark:text-white">
          Profile
        </h1>
      </div>
    </UserDashboard>
  );
}
