import { CustomerInsights } from "./components/customer-insights"
import { MetricsOverview } from "./components/metrics-overview"
import { QuickActions } from "./components/quick-actions"
import { RecentTransactions, ActivityLogItem } from "./components/recent-transactions"
import { RevenueBreakdown } from "./components/revenue-breakdown"
import { SalesChart } from "./components/sales-chart"
import { TopProducts } from "./components/top-products"
import { 
  getMetricsOverviewData, 
  getSalesChartData, 
  getRevenueBreakdownData, 
  getTopProductsData, 
  getCustomerInsightsData 
} from "@/lib/data-layer/admin/dashboard"

export default async function AdminDashboard({ activities }: { activities: ActivityLogItem[] }) {
  // Fetch all dashboard data concurrently
  const [
    metricsData,
    salesData,
    revenueData,
    topProductsData,
    customerInsightsData
  ] = await Promise.all([
    getMetricsOverviewData(),
    getSalesChartData(12),
    getRevenueBreakdownData(),
    getTopProductsData(),
    getCustomerInsightsData()
  ]);

  return (
    <div className="flex-1 space-y-6 px-6 pt-6">
      {/* Enhanced Header */}

      <div className="flex md:flex-row flex-col md:items-center justify-between gap-4 md:gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Business Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your business performance and key metrics in real-time
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Main Dashboard Grid */}
      <div className="@container/main space-y-6">
        {/* Top Row - Key Metrics */}

        <MetricsOverview data={metricsData} />

        {/* Second Row - Charts in 6-6 columns */}
        <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
          <SalesChart data={salesData} />
          <RevenueBreakdown data={revenueData} />
        </div>

        {/* Third Row - Two Column Layout */}
        <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
          <RecentTransactions activities={activities} />
          <TopProducts data={topProductsData} />
        </div>

        {/* Fourth Row - Customer Insights and Team Performance */}
        <CustomerInsights data={customerInsightsData} />
      </div>
    </div>
  )
}
