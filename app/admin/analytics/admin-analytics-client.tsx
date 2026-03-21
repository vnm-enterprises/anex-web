"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader2,
  TrendingUp,
  Users,
  Home,
  MessageSquare,
  DollarSign,
  Zap,
  MapPin,
  PieChart as PieChartIcon,
} from "lucide-react";
import { formatPrice } from "@/lib/constants";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";

const COLORS = [
  "#0ea5e9",
  "#6366f1",
  "#f59e0b",
  "#ec4899",
  "#10b981",
  "#8b5cf6",
];

export function AdminAnalyticsClient() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [districtData, setDistrictData] = useState<any[]>([]);
  const [paymentMixData, setPaymentMixData] = useState<any[]>([]);
  const [performanceStats, setPerformanceStats] = useState<any>(null);

  const fetchAnalytics = async () => {
    setLoading(true);

    const thirtyDaysAgo = subDays(new Date(), 30);
    // 1. Core data sources
    const [
      { count: totalUsers },
      { count: totalListingsAll },
      { count: activeListingsCount },
      { data: paymentsLast30d },
      { data: paymentsAllPaid },
      { data: listingsDataAll },
      { data: listingsData30d },
      { data: profilesData30d },
      { data: districtsData },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("listings").select("*", { count: "exact", head: true }),
      supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved"),
      supabase
        .from("payments")
        .select("amount, created_at, payment_type")
        .eq("status", "paid")
        .gte("created_at", thirtyDaysAgo.toISOString()),
      supabase
        .from("payments")
        .select("amount, created_at, payment_type")
        .eq("status", "paid"),
      supabase
        .from("listings")
        .select(
          "id, created_at, property_type, district_id, views_count, inquiries_count, boost_weight, status",
        ),
      supabase
        .from("listings")
        .select(
          "id, created_at, property_type, district_id, views_count, inquiries_count, boost_weight, status",
        )
        .gte("created_at", thirtyDaysAgo.toISOString()),
      supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", thirtyDaysAgo.toISOString()),
      supabase.from("districts").select("id, name"),
    ]);

    const paid30d = paymentsLast30d ?? [];
    const paidAll = paymentsAllPaid ?? [];
    const listingsAll = listingsDataAll ?? [];
    const listings30d = listingsData30d ?? [];

    // 2. Revenue Trend (Last 30 Days)
    const days = eachDayOfInterval({
      start: thirtyDaysAgo,
      end: new Date(),
    });

    const dailyRevenue = days.map((day) => {
      const dateStr = format(day, "MMM dd");
      const totalForDay = paid30d
        ?.filter(
          (p) =>
            format(new Date(p.created_at), "yyyy-MM-dd") ===
            format(day, "yyyy-MM-dd"),
        )
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        name: dateStr,
        revenue: (totalForDay || 0) / 100, // Assuming cents to LKR
      };
    });

    // 3. Growth Data (Users vs Listings)
    const dailyGrowth = days.map((day) => {
      const dateStr = format(day, "MMM dd");
      const usersCount = profilesData30d?.filter(
        (p) =>
          format(new Date(p.created_at), "yyyy-MM-dd") ===
          format(day, "yyyy-MM-dd"),
      ).length;
      const listingsCount = listings30d?.filter(
        (l) =>
          format(new Date(l.created_at), "yyyy-MM-dd") ===
          format(day, "yyyy-MM-dd"),
      ).length;

      return {
        name: dateStr,
        users: usersCount || 0,
        listings: listingsCount || 0,
      };
    });

    // 4. Category Distribution
    const categories: Record<string, number> = {};
    listingsAll
      ?.filter((l) => l.status === "approved")
      .forEach((l) => {
      categories[l.property_type] = (categories[l.property_type] || 0) + 1;
    });
    const pieData = Object.entries(categories).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));

    // 5. Regional Distribution (Top Districts)
    const districtCounts: Record<string, number> = {};
    listingsAll
      ?.filter((l) => l.status === "approved")
      .forEach((l) => {
      const districtName =
        districtsData?.find((d) => d.id === l.district_id)?.name || "Unknown";
      districtCounts[districtName] = (districtCounts[districtName] || 0) + 1;
    });
    const barData = Object.entries(districtCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // 6. Performance Insights (Boosted vs Standard)
    const boostedListings =
      listingsAll?.filter((l) => l.status === "approved" && (l.boost_weight ?? 0) > 0) || [];
    const standardListings =
      listingsAll?.filter((l) => l.status === "approved" && (l.boost_weight ?? 0) === 0) || [];

    const avgViewsBoosted =
      boostedListings.length > 0
        ? boostedListings.reduce((sum, l) => sum + (l.views_count || 0), 0) /
          boostedListings.length
        : 0;
    const avgViewsStandard =
      standardListings.length > 0
        ? standardListings.reduce((sum, l) => sum + (l.views_count || 0), 0) /
          standardListings.length
        : 0;

    const avgInqBoosted =
      boostedListings.length > 0
        ? boostedListings.reduce(
            (sum, l) => sum + (l.inquiries_count || 0),
            0,
          ) / boostedListings.length
        : 0;
    const avgInqStandard =
      standardListings.length > 0
        ? standardListings.reduce(
            (sum, l) => sum + (l.inquiries_count || 0),
            0,
          ) / standardListings.length
        : 0;

    // 7. Revenue + conversion KPIs
    const totalGrossRevenue =
      paidAll.reduce((sum, p) => sum + Number(p.amount || 0), 0) / 100;
    const listingRevenue =
      paidAll
        .filter((p) => p.payment_type === "ad_listing")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0) / 100;
    const boostRevenue =
      paidAll
        .filter((p) => p.payment_type === "boost")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0) / 100;
    const paidTransactions = paidAll.length;
    const avgOrderValue = paidTransactions > 0 ? totalGrossRevenue / paidTransactions : 0;

    const totalViews = listingsAll.reduce(
      (sum, listing) => sum + Number(listing.views_count || 0),
      0,
    );
    const totalInquiries = listingsAll.reduce(
      (sum, listing) => sum + Number(listing.inquiries_count || 0),
      0,
    );
    const inquiryRate = totalViews > 0 ? (totalInquiries / totalViews) * 100 : 0;

    const boostCoverage =
      (activeListingsCount || 0) > 0
        ? (boostedListings.length / (activeListingsCount || 1)) * 100
        : 0;

    const paymentMix = [
      { name: "Listing Fees", value: Number(listingRevenue.toFixed(2)) },
      { name: "Boost Sales", value: Number(boostRevenue.toFixed(2)) },
    ];

    setStats({
      totalUsers: totalUsers || 0,
      totalListings: totalListingsAll || 0,
      activeListings: activeListingsCount || 0,
      totalRevenue: totalGrossRevenue,
      listingRevenue,
      boostRevenue,
      paidTransactions,
      avgOrderValue,
      inquiryRate,
      boostCoverage,
      monthlyRevenue: dailyRevenue.reduce((sum, d) => sum + d.revenue, 0),
    });

    setRevenueData(dailyRevenue);
    setGrowthData(dailyGrowth);
    setCategoryData(pieData);
    setDistrictData(barData);
    setPaymentMixData(paymentMix);
    setPerformanceStats({
      boosted: { views: avgViewsBoosted, inq: avgInqBoosted },
      standard: { views: avgViewsStandard, inq: avgInqStandard },
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
            Analyzing Platform Data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            <TrendingUp className="h-3 w-3" />
            Live Insights
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
            Executive <span className="text-primary italic">Dashboard</span>
          </h1>
        </div>
      </div>

      {/* === TOP METRICS === */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Gross Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={<DollarSign className="h-5 w-5" />}
          description="All paid transactions"
          trend={`${(stats.paidTransactions || 0).toLocaleString()} txns`}
        />
        <MetricCard
          title="Monthly Revenue"
          value={formatPrice(stats.monthlyRevenue)}
          icon={<TrendingUp className="h-5 w-5" />}
          description="Last 30 days"
          trend={`AOV ${formatPrice(stats.avgOrderValue || 0)}`}
        />
        <MetricCard
          title="Total Members"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          description="Active profiles"
          trend="users"
        />
        <MetricCard
          title="Active Listings"
          value={(stats.activeListings || 0).toLocaleString()}
          icon={<Home className="h-5 w-5" />}
          description="Approved properties"
          trend={`${(stats.totalListings || 0).toLocaleString()} total`}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Listing Revenue"
          value={formatPrice(stats.listingRevenue || 0)}
          icon={<MessageSquare className="h-5 w-5" />}
          description="Ad listing payments"
        />
        <MetricCard
          title="Boost Revenue"
          value={formatPrice(stats.boostRevenue || 0)}
          icon={<Zap className="h-5 w-5" />}
          description="Quick/Premium/Featured sales"
        />
        <MetricCard
          title="Inquiry Rate"
          value={`${Number(stats.inquiryRate || 0).toFixed(2)}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          description="Inquiries / total views"
        />
        <MetricCard
          title="Boost Coverage"
          value={`${Number(stats.boostCoverage || 0).toFixed(1)}%`}
          icon={<Zap className="h-5 w-5" />}
          description="Boosted among approved"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* === REVENUE TREND === */}
        <Card className="border-none soft-shadow-xl overflow-hidden bg-card/50 backdrop-blur-xl rounded-[2.5rem]">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <TrendingUp size={20} />
              </div>
              Revenue Trend (30d)
            </CardTitle>
            <CardDescription className="font-medium">
              Daily earnings growth across all payment types.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(0,0,0,0.05)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#888" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#888" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "1rem",
                    border: "none",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    fontWeight: 900,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* === GROWTH COMPARISON === */}
        <Card className="border-none soft-shadow-xl overflow-hidden bg-card/50 backdrop-blur-xl rounded-[2.5rem]">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Zap size={20} />
              </div>
              Platform Growth
            </CardTitle>
            <CardDescription className="font-medium">
              New users vs property listings created.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorList" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(0,0,0,0.05)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#888" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#888" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "1rem",
                    border: "none",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    fontWeight: 900,
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: 20,
                    fontSize: 10,
                    fontWeight: 900,
                    textTransform: "uppercase",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  fill="url(#colorUsers)"
                  name="New Users"
                />
                <Area
                  type="monotone"
                  dataKey="listings"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#colorList)"
                  name="New Listings"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* === PROPERTY DISTRIBUTION === */}
        <Card className="border-none soft-shadow-xl overflow-hidden bg-card/50 backdrop-blur-xl rounded-[2.5rem]">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                <PieChartIcon size={20} />
              </div>
              Property Types
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 900 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* === PAYMENT MIX === */}
        <Card className="border-none soft-shadow-xl overflow-hidden bg-card/50 backdrop-blur-xl rounded-[2.5rem]">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <DollarSign size={20} />
              </div>
              Revenue Mix
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMixData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMixData.map((entry, index) => (
                    <Cell
                      key={`mix-cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 900 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* === TOP DISTRICTS === */}
        <Card className="border-none soft-shadow-xl overflow-hidden bg-card/50 backdrop-blur-xl rounded-[2.5rem] lg:col-span-1">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <MapPin size={20} />
              </div>
              Top Performing Districts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="rgba(0,0,0,0.05)"
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 900 }}
                />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.02)" }} />
                <Bar
                  dataKey="count"
                  fill="#4f46e5"
                  radius={[0, 10, 10, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* === PERFORMANCE COMPARISON === */}
      <h3 className="text-2xl font-black tracking-tighter mt-12 mb-6">
        Boost Performance <span className="text-primary">Analysis</span>
      </h3>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="p-8 rounded-[2.5rem] bg-indigo-600/5 border border-indigo-600/10 space-y-6">
          <div className="flex justify-between items-center">
            <div className="p-3 rounded-2xl bg-indigo-600 text-white">
              <TrendingUp size={24} />
            </div>
            <div className="text-right">
              <p className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-1">
                Boosted Listings
              </p>
              <h4 className="text-2xl font-black tracking-tight">
                Advanced Visibility
              </h4>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white soft-shadow-sm">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-2">
                Avg. Views
              </p>
              <p className="text-3xl font-black text-indigo-600">
                {performanceStats?.boosted.views.toFixed(1)}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white soft-shadow-sm">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-2">
                Avg. Inquiries
              </p>
              <p className="text-3xl font-black text-indigo-600">
                {performanceStats?.boosted.inq.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-muted/30 border border-border space-y-6">
          <div className="flex justify-between items-center">
            <div className="p-3 rounded-2xl bg-muted text-muted-foreground">
              <TrendingUp size={24} />
            </div>
            <div className="text-right">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
                Standard Listings
              </p>
              <h4 className="text-2xl font-black tracking-tight">
                Organic Reach
              </h4>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white/50 border border-border">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-2">
                Avg. Views
              </p>
              <p className="text-3xl font-black text-foreground">
                {performanceStats?.standard.views.toFixed(1)}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/50 border border-border">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-2">
                Avg. Inquiries
              </p>
              <p className="text-3xl font-black text-foreground">
                {performanceStats?.standard.inq.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  description,
  trend,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: string;
}) {
  return (
    <Card className="border-none soft-shadow-xl overflow-hidden bg-card/50 backdrop-blur-xl rounded-[2.5rem] group hover:bg-primary transition-all duration-500">
      <CardHeader className="p-8 pb-4">
        <div className="flex justify-between items-start">
          <div className="p-3 rounded-2xl bg-muted group-hover:bg-white/20 text-muted-foreground group-hover:text-white transition-colors duration-500">
            {icon}
          </div>
          {trend && (
            <span className="text-[10px] font-black py-1 px-2 rounded-full bg-emerald-500/10 text-emerald-500 group-hover:bg-white/20 group-hover:text-white transition-colors duration-500">
              {trend}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        <div className="space-y-1">
          <p className="text-sm font-black text-muted-foreground uppercase tracking-widest group-hover:text-white/70 transition-colors duration-500">
            {title}
          </p>
          <div className="text-4xl font-black text-foreground tracking-tighter group-hover:text-white transition-colors duration-500">
            {value}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground font-medium group-hover:text-white/60 transition-colors duration-500 pt-2">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
