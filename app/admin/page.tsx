import AdminDashboard from "@/components/admin/home/adminDashboard";
import { getRecentActivities } from "@/lib/data-layer/admin/admin";

const Page = async () => {
  const recentActivities = await getRecentActivities(5);

  return (
    <div>
      <AdminDashboard activities={recentActivities} />
    </div>
  );
};

export default Page;
