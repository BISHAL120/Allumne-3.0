import { redirect } from "next/navigation";

const Page = () => {
  redirect("/admin/customers/statistics");
};

export default Page;
