import CustomersListPage from "@/components/admin/customers/customers-list-page";
import {
  CustomerFilter,
  CustomerSort,
  getCustomersListData,
} from "@/lib/data-layer/admin/customers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer List",
  description: "Search, filter, sort and paginate all customers",
};

const allowedFilter = new Set(["all", "with_orders", "without_orders", "repeat"]);
const allowedSort = new Set(["newest", "oldest", "name_asc", "name_desc"]);

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;

  const page = Number(params?.page || "1");
  const per_page = Number(params?.per_page || "10");
  const search = params?.search || "";
  const filter = allowedFilter.has(params?.filter || "")
    ? (params?.filter as CustomerFilter)
    : "all";
  const sort = allowedSort.has(params?.sort || "")
    ? (params?.sort as CustomerSort)
    : "newest";

  const data = await getCustomersListData({
    page,
    per_page,
    search,
    filter,
    sort,
  });

  return (
    <CustomersListPage
      customers={data.customers}
      pagination={data.pagination}
      initialQuery={{ search, filter, sort }}
    />
  );
};

export default Page;
