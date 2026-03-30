import PermissionsPage from "@/components/admin/permissions/permissions";
import { getAllUsers } from "@/lib/data-layer/admin/admin";

const Page = async ({searchParams}: {searchParams: Promise<{ [key: string]: string | undefined }>}) => {

    const params = await searchParams;
    const search = params?.search || "";
    const page = Number(params?.page || 1);

    const {users, pagination} = await getAllUsers({search, page, per_page: 10});

  return (
    <div>
      <PermissionsPage users={users} pagination={pagination} />
    </div>
  );
};

export default Page;
