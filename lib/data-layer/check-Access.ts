
import { redirect } from "next/navigation";
import { getServerSession } from "../get-session";

export async function isAdmin() {
    const session = await getServerSession();
    const user = session?.user;
    if (!user?.role?.includes("ADMIN")) {
        redirect("/")
    }
    return user;
}


export async function isArtist() {
  const { user } = (await getServerSession()) ?? {};
  const allowedRoles = ["ARTIST", "COLLECTOR", "ADMIN"];
  const hasRole = allowedRoles.some(role => user?.role?.includes(role));
  if (!hasRole) redirect("/");
  return user;
}
