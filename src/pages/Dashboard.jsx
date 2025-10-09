import React, { useState, useEffect } from "react";
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CreditCard,
  MessageSquare,
  Bell,
  Eye,
  UserCheck,
  UserX,
  Calendar,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CHART_COLORS, API_CONFIG } from "../config/constants";
import { useApp } from "../contexts/AppContext";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import StatsCard from "../components/common/StatsCard";
import { getDashboardData } from "../contexts/dashboardApi";

const Dashboard = () => {
  const { addNotification } = useApp();
  const [stats, setStats] = useState({
    totalUsers: 12345,
    activeUsers: 8432,
    blockedUsers: 234,
    totalRevenue: 1234567,
    monthlyRevenue: 89432,
    totalTransactions: 5678,
    pendingTickets: 23,
    activeSessions: 1432,
  });


  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const [salesGraph, setSalesGraph] = useState([]);


  useEffect(() => {
    const loadDashboard = async () => {
      const result = await getDashboardData();
      if (result.success) {
        setDashboard(result.data);
        setSalesGraph(result.data.sales_graph || []); // 👈 set chart data here
      } else {
        console.error(result.error);
      }
      setLoading(false);
    };
    loadDashboard();
  }, []);



  // Revenue chart data (monthly)
  const [revenueData] = useState([
    { month: "Jan", revenue: 45000, users: 1200, transactions: 450 },
    { month: "Feb", revenue: 52000, users: 1350, transactions: 520 },
    { month: "Mar", revenue: 48000, users: 1280, transactions: 480 },
    { month: "Apr", revenue: 61000, users: 1520, transactions: 610 },
    { month: "May", revenue: 55000, users: 1420, transactions: 550 },
    { month: "Jun", revenue: 67000, users: 1680, transactions: 670 },
    { month: "Jul", revenue: 72000, users: 1800, transactions: 720 },
    { month: "Aug", revenue: 69000, users: 1750, transactions: 690 },
    { month: "Sep", revenue: 78000, users: 1950, transactions: 780 },
    { month: "Oct", revenue: 84000, users: 2100, transactions: 840 },
    { month: "Nov", revenue: 89000, users: 2250, transactions: 890 },
    { month: "Dec", revenue: 95000, users: 2400, transactions: 950 },
  ]);

  const userAnalytics = [
    {
      name: "Total Customers",
      value: Number(dashboard?.total_customers?.value) || 0,
      color: CHART_COLORS.primary,
    },
    {
      name: "Total Cleaners",
      value: Number(dashboard?.total_cleaners?.value) || 0,
      color: CHART_COLORS.secondary,
    },
    {
      name: "Total Bookings",
      value: Number(dashboard?.total_bookings?.value) || 0,
      color: "#22c55e", // green (success color)
    },

  ];


  // Recent activities
  const [recentActivities] = useState([
    {
      id: 1,
      type: "user_registered",
      user: "John Doe",
      time: "2 minutes ago",
      icon: UserCheck,
    },
    {
      id: 2,
      type: "transaction_completed",
      user: "Jane Smith",
      amount: 299,
      time: "5 minutes ago",
      icon: CreditCard,
    },
    {
      id: 3,
      type: "support_ticket",
      user: "Bob Johnson",
      time: "10 minutes ago",
      icon: MessageSquare,
    },
    {
      id: 4,
      type: "user_blocked",
      user: "Alice Brown",
      time: "15 minutes ago",
      icon: UserX,
    },
    {
      id: 5,
      type: "notification_sent",
      count: 1250,
      time: "30 minutes ago",
      icon: Bell,
    },
  ]);

  // Transaction status data
  const [transactionData] = useState([
    { status: "Completed", count: 4521, amount: 892340 },
    { status: "Pending", count: 234, amount: 45670 },
    { status: "Failed", count: 123, amount: 12340 },
    { status: "Refunded", count: 89, amount: 8900 },
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      user_registered: UserCheck,
      transaction_completed: CreditCard,
      support_ticket: MessageSquare,
      user_blocked: UserX,
      notification_sent: Bell,
    };
    return iconMap[type] || Activity;
  };

  const getActivityColor = (type) => {
    const colorMap = {
      user_registered: "text-green-600",
      transaction_completed: "text-blue-600",
      support_ticket: "text-yellow-600",
      user_blocked: "text-red-600",
      notification_sent: "text-purple-600",
    };
    return colorMap[type] || "text-gray-600";
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "danger";
      case "refunded":
        return "info";
      default:
        return "default";
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new activity
      const activities = [
        "New user registered",
        "Transaction completed",
        "Support ticket created",
        "User blocked",
        "Notification sent",
      ];

      const randomActivity =
        activities[Math.floor(Math.random() * activities.length)];

      addNotification({
        title: "System Update",
        message: randomActivity,
        type: "info",
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [addNotification]);

  const mainStats = [
    {
      title: "Total Customers",
      value: dashboard?.total_customers?.value || "0",
      change: dashboard?.total_customers?.change_from_yesterday || "0%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Total Cleaners",
      value: dashboard?.total_cleaners?.value || "0",
      change: dashboard?.total_cleaners?.change_from_yesterday || "0%",
      trend: "up",
      icon: UserCheck,
    },
    {
      title: "Total Bookings",
      value: dashboard?.total_bookings?.value || "0",
      change: dashboard?.total_bookings?.change_from_yesterday || "0%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Reported Users",
      value: dashboard?.reported_users?.value || "0",
      change: dashboard?.reported_users?.change_from_yesterday || "0%",
      trend: "down",
      icon: MessageSquare,
    },
  ];

  // const secondaryStats = [
  //   {
  //     title: "Active Users",
  //     value: formatNumber(stats.activeUsers),
  //     change: "+3.2%",
  //     trend: "up",
  //     icon: UserCheck,
  //   },
  //   {
  //     title: "Blocked Users",
  //     value: stats.blockedUsers,
  //     change: "+2.1%",
  //     trend: "up",
  //     icon: UserX,
  //   },
  //   {
  //     title: "Total Transactions",
  //     value: formatNumber(stats.totalTransactions),
  //     change: "+18.7%",
  //     trend: "up",
  //     icon: CreditCard,
  //   },
  //   {
  //     title: "Total Revenue",
  //     value: formatCurrency(stats.totalRevenue),
  //     change: "+22.4%",
  //     trend: "up",
  //     icon: TrendingUp,
  //   },
  // ];

  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard - Welcome
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.trend === "up" ? "positive" : "negative"}
            icon={stat.icon ? <stat.icon /> : null}
            index={index}
          />
        ))}
      </div>

      {/* Secondary Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {secondaryStats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.trend === "up" ? "positive" : "negative"}
            icon={stat.icon ? <stat.icon /> : null}
            index={index + 2}
          />
        ))}
      </div> */}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        {/* User Growth (Sales Graph) */}
        <Card>
  <Card.Header>
    <Card.Title>Service Sales Over Time</Card.Title>
  </Card.Header>

  <Card.Content className="chart-container">
    {salesGraph.length === 0 ? (
      <div className="w-full h-[300px] flex items-center justify-center relative bg-gradient-to-br from-white to-white rounded-lg overflow-hidden">
        {/* Faint mock graph line */}
        <svg
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full opacity-30"
        >
          <path
            d="M0,150 Q100,180 200,120 T400,60"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
          </defs>
        </svg>

        {/* Downward arrow + message */}
        <div className="flex flex-col items-center text-gray-400 z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-black mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
          </svg>
          <p className="text-sm text-gray-400">No sales data available</p>
        </div>
      </div>
    ) : (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={salesGraph}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="time"
            stroke="#6B7280"
            tickFormatter={(t) =>
              new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            }
          />
          <YAxis stroke="#6B7280" />
          <Tooltip
            labelFormatter={(label) =>
              new Date(label).toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                weekday: "short",
                month: "short",
                day: "numeric",
              })
            }
            formatter={(value) => [`$${value.toFixed(2)}`, "Service Sales"]}
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB",
            }}
          />
          <Line
            type="monotone"
            dataKey="service_sales"
            stroke={CHART_COLORS.primary}
            strokeWidth={3}
            dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )}
  </Card.Content>
</Card>



        {/* User Analytics Pie Chart */}
        <Card>
          <Card.Header>
            <Card.Title>User Status Distribution</Card.Title>
          </Card.Header>
          <Card.Content className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userAnalytics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userAnalytics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatNumber(value), "Users"]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;
