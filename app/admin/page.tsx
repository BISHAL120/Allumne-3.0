import AdminDashboard from "@/components/admin/home/adminDashboard";
import { AdminPanelReport } from "@/lib/data-layer/admin/admin";

const Page = async () => {
  
  const CurrentMonthRevenue = await AdminPanelReport();

  console.log("Admin Dashboard Report :", CurrentMonthRevenue)

  return (
    <div>
      <AdminDashboard />
    </div>
  );
};

export default Page;
