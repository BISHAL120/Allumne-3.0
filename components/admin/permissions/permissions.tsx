"use client";

import PaginatioComponent, {
  PaginationProps,
} from "@/components/shared/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { showError, showLoading, showSuccess } from "@/lib/toast";
import { Role, User } from "@prisma/client";
import axios from "axios";
import {
  Briefcase,
  ChevronDown,
  Palette,
  Search,
  Shield,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/* 
ADMIN
  MANAGER
  EDITOR
  USER
*/

// Role Badge Component with dynamic styling
const RoleBadge = ({ role }: { role: Role }) => {
  const getRoleStyle = (role: Role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
      case "MANAGER":
        return "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200";
      case "EDITOR":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
      case "USER":
        return "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-3 h-3 mr-1" />;
      case "MANAGER":
        return <Palette className="w-3 h-3 mr-1" />;
      case "EDITOR":
        return <Briefcase className="w-3 h-3 mr-1" />;
      default:
        return <UserIcon className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <Badge variant="outline" className={`pl-2 pr-3 py-1 ${getRoleStyle(role)}`}>
      {getRoleIcon(role)}
      {role}
    </Badge>
  );
};

const PermissionsPage = ({
  users,
  pagination,
}: {
  users: User[];
  pagination: PaginationProps;
}) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Debounce Search Input
  useEffect(() => {
    // Create timeout to delay URL update
    const timeoutId = setTimeout(() => {
      // Build query params object
      const params = new URLSearchParams();

      if (search) params.set("search", search);

      if (pagination.page) params.set("page", pagination.page.toString());

      // Construct URL with query params
      const url = `/admin/permissions${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      // Only update URL if params changed
      if (url !== window.location.pathname + window.location.search) {
        router.push(url);
      }
    }, 500); // 0.5 second delay

    // Cleanup timeout on unmount or when dependencies change
    return () => clearTimeout(timeoutId);
  }, [search, pagination.page, router]);

  const handlePermissions = (
    userId: string,
    currentRoles: Role[],
    roleToToggle: Role,
  ) => {
    setLoading(true);
    showLoading("Updating permissions...");

    // Toggle role in currentRoles array
    const updatedRoles = currentRoles.includes(roleToToggle)
      ? currentRoles.filter((role) => role !== roleToToggle)
      : [...currentRoles, roleToToggle];

    console.log(`Final roles updated for user ${userId}:`, updatedRoles);

    axios
      .patch("/api/admin/permissions", {
        id: userId,
        role: updatedRoles,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.dismiss();
          showSuccess({
            message: res.data.message || "Permissions updated successfully",
          });
          router.refresh();
        }
      })
      .catch((error) => {
        toast.dismiss();
        showError({
          message:
            error.response?.data?.message || "Error updating permissions",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            User Permissions
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage user roles and access levels across the platform.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Users Directory</CardTitle>
          <CardDescription>
            A list of all users including their name, email, and current role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-75">User</TableHead>
                  <TableHead>Current Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users
                    .filter((user) =>
                      user.name.toLowerCase().includes(search.toLowerCase()),
                    )
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={
                                  user.image ||
                                  `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                                }
                              />
                              <AvatarFallback>
                                {user.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">{user.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.role.map((role) => (
                              <RoleBadge key={role} role={role} />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.isActive ? "default" : "secondary"}
                            className={
                              user.isActive
                                ? "bg-green-500 hover:bg-green-600"
                                : ""
                            }
                          >
                            {user.isActive ? "active" : "inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild disabled={loading}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto"
                              >
                                Edit Roles{" "}
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>
                                Assign Roles
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {Object.values(Role).map((role) => (
                                <DropdownMenuCheckboxItem
                                  key={role}
                                  checked={user.role.includes(role)}
                                  onCheckedChange={() =>
                                    handlePermissions(user.id, user.role, role)
                                  }
                                >
                                  {role}
                                </DropdownMenuCheckboxItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <PaginatioComponent pagination={pagination} query={{ search }} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsPage;
