"use client";

import { format } from "date-fns";
import {
  Calendar,
  Edit,
  Layers,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";

import PageTittle from "@/components/admin/shared/pageTittle";
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
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Category } from "@prisma/client";

const AllCategories = ({ categories }: { categories: Category[] }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <PageTittle
            title="All Categories"
            description="Manage your product categories and classification"
          />
          <Button onClick={() => router.push("/admin/categories/id")}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Category
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-violet-500" />
                  Category List
                </CardTitle>
                <CardDescription>
                  You have {categories.length} categories in total
                </CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  className="pl-9"
                  //   value={searchQuery}
                  //   onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <TableRow>
                    <TableHead className="w-62.5">Category Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-32 text-center text-muted-foreground"
                      >
                        No categories found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => (
                      <TableRow
                        key={category.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-slate-100">
                              {category.name}
                            </span>
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {category.desc || "No description"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">
                            /{category.slug}
                          </code>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            {format(
                              new Date(category?.createdAt),
                              "MMM d, yyyy"
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/admin/categories/id/?categoryId=${category.id}`
                                    )
                                  }
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Category
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllCategories;
