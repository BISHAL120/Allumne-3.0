import AdminDashboard from "@/components/admin/home/adminDashboard";
import { AdminPanelReport, getRecentActivities } from "@/lib/data-layer/admin/admin";

const Page = async () => {
  
  const CurrentMonthRevenue = await AdminPanelReport();
  const recentActivities = await getRecentActivities(5);

  console.log("Admin Dashboard Report :", CurrentMonthRevenue)

  return (
    <div>
      <AdminDashboard activities={recentActivities} />
    </div>
  );
};

export default Page;
