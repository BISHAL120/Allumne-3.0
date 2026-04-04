import GenerateDashboardSeed from "@/components/admin/generator/dashboard/generate-dashboard-seed";
import { getServerSession } from "@/lib/get-session";

const Page = async () => {
  const session = await getServerSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Please login first");
  }

  return <GenerateDashboardSeed />;
};

export default Page;
