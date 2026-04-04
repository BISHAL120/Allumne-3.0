import { formatDistanceToNow } from "date-fns";
import { DollarSign, Repeat2, Trophy, UserPlus, Users } from "lucide-react";
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  CustomerListItem,
  CustomersStats,
} from "@/lib/data-layer/admin/customers";

export default function CustomersStatisticsPage({
  stats,
  topCustomers,
}: {
  stats: CustomersStats;
  topCustomers: CustomerListItem[];
}) {
  return (
    <div className="min-h-screen space-y-6 p-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          icon={<Users className="h-4 w-4 text-primary" />}
        />
        <StatCard
          label="New This Month"
          value={stats.newThisMonth.toLocaleString()}
          icon={<UserPlus className="h-4 w-4 text-primary" />}
        />
        <StatCard
          label="Active (30 Days)"
          value={stats.activeLast30Days.toLocaleString()}
          icon={<Users className="h-4 w-4 text-primary" />}
        />
        <StatCard
          label="Repeat Customers"
          value={stats.repeatCustomers.toLocaleString()}
          icon={<Repeat2 className="h-4 w-4 text-primary" />}
        />
        <StatCard
          label="Avg Order Value"
          value={`$${stats.avgOrderValue.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4 text-primary" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Top Customers
          </CardTitle>
          <CardDescription>Customers ranked by total spending.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {topCustomers.length === 0 && (
            <p className="text-sm text-muted-foreground">No customer order data found yet.</p>
          )}
          {topCustomers.map((customer, index) => (
            <div key={customer.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="font-semibold">
                  #{index + 1} {customer.fullName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {customer.orderCount} orders
                  {customer.lastOrderAt
                    ? ` • last order ${formatDistanceToNow(customer.lastOrderAt, { addSuffix: true })}`
                    : ""}
                </p>
              </div>
              <p className="text-lg font-bold">${customer.totalSpent.toLocaleString()}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          {icon}
        </div>
        <p className="mt-2 text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
