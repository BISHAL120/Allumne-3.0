import CustomersStatisticsPage from "@/components/admin/customers/customers-statistics-page";
import { getCustomerStatisticsData } from "@/lib/data-layer/admin/customers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Statistics",
  description: "Customer analytics and top customers",
};

const Page = async () => {
  const data = await getCustomerStatisticsData();
  return <CustomersStatisticsPage stats={data.stats} topCustomers={data.topCustomers} />;
};

export default Page;
