"use client"

// Mock API functions that simulate real backend calls
export interface KPIData {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  rawValue: number
}

export interface CampaignData {
  id: string
  name: string
  clicks: number
  conversions: number
  spend: number
  revenue: number
  status: "active" | "paused" | "completed"
  startDate: string
  endDate: string
}

export interface RevenueData {
  month: string
  revenue: number
  impressions: number
  date: string
}

export interface TrafficSource {
  name: string
  value: number
  color: string
  sessions: number
}

export interface DeviceData {
  device: string
  sessions: number
  conversions: number
  icon: string
}

export interface ActivityItem {
  id: string
  title: string
  description: string
  time: string
  type: "success" | "warning" | "info"
  icon: string
  timestamp: Date
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock data generators
const generateKPIData = (dateRange: string): KPIData[] => {
  const multiplier = dateRange === "Last 7 days" ? 0.3 : dateRange === "Last 90 days" ? 3 : 1

  return [
    {
      title: "Total Revenue",
      value: `$${(124563 * multiplier).toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      rawValue: 124563 * multiplier,
    },
    {
      title: "Impressions",
      value: `${(2.4 * multiplier).toFixed(1)}M`,
      change: "+8.2%",
      trend: "up",
      rawValue: 2400000 * multiplier,
    },
    {
      title: "Click Rate",
      value: "3.24%",
      change: "-0.4%",
      trend: "down",
      rawValue: 3.24,
    },
    {
      title: "Conversions",
      value: `${Math.round(1429 * multiplier).toLocaleString()}`,
      change: "+18.7%",
      trend: "up",
      rawValue: 1429 * multiplier,
    },
  ]
}

const generateRevenueData = (dateRange: string): RevenueData[] => {
  const baseData = [
    { month: "Jan", revenue: 45000, impressions: 1200000, date: "2024-01-01" },
    { month: "Feb", revenue: 52000, impressions: 1350000, date: "2024-02-01" },
    { month: "Mar", revenue: 48000, impressions: 1180000, date: "2024-03-01" },
    { month: "Apr", revenue: 61000, impressions: 1420000, date: "2024-04-01" },
    { month: "May", revenue: 55000, impressions: 1380000, date: "2024-05-01" },
    { month: "Jun", revenue: 67000, impressions: 1520000, date: "2024-06-01" },
  ]

  if (dateRange === "Last 7 days") {
    return baseData.slice(-1).map((item) => ({
      ...item,
      month: "This Week",
      revenue: Math.round(item.revenue * 0.25),
      impressions: Math.round(item.impressions * 0.25),
    }))
  }

  return baseData
}

const generateCampaignData = (): CampaignData[] => [
  {
    id: "1",
    name: "Summer Sale",
    clicks: 12500,
    conversions: 450,
    spend: 8500,
    revenue: 22000,
    status: "active",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
  },
  {
    id: "2",
    name: "Brand Awareness",
    clicks: 8200,
    conversions: 180,
    spend: 5200,
    revenue: 9800,
    status: "paused",
    startDate: "2024-05-15",
    endDate: "2024-07-15",
  },
  {
    id: "3",
    name: "Product Launch",
    clicks: 15600,
    conversions: 680,
    spend: 12000,
    revenue: 34500,
    status: "active",
    startDate: "2024-06-15",
    endDate: "2024-09-15",
  },
  {
    id: "4",
    name: "Holiday Special",
    clicks: 9800,
    conversions: 320,
    spend: 6800,
    revenue: 16200,
    status: "active",
    startDate: "2024-07-01",
    endDate: "2024-12-31",
  },
]

// API Functions
export const fetchKPIData = async (dateRange: string): Promise<KPIData[]> => {
  await delay(500)
  return generateKPIData(dateRange)
}

export const fetchRevenueData = async (dateRange: string): Promise<RevenueData[]> => {
  await delay(800)
  return generateRevenueData(dateRange)
}

export const fetchCampaignData = async (): Promise<CampaignData[]> => {
  await delay(600)
  return generateCampaignData()
}

export const fetchTrafficSources = async (): Promise<TrafficSource[]> => {
  await delay(400)
  return [
    { name: "Google Ads", value: 45, color: "#8b5cf6", sessions: 180000 },
    { name: "Facebook", value: 25, color: "#06b6d4", sessions: 100000 },
    { name: "Instagram", value: 15, color: "#f59e0b", sessions: 60000 },
    { name: "LinkedIn", value: 10, color: "#10b981", sessions: 40000 },
    { name: "Others", value: 5, color: "#ef4444", sessions: 20000 },
  ]
}

export const fetchDeviceData = async (): Promise<DeviceData[]> => {
  await delay(300)
  return [
    { device: "Desktop", sessions: 45000, conversions: 1200, icon: "💻" },
    { device: "Mobile", sessions: 38000, conversions: 980, icon: "📱" },
    { device: "Tablet", sessions: 12000, conversions: 240, icon: "📱" },
  ]
}

export const fetchRecentActivity = async (): Promise<ActivityItem[]> => {
  await delay(200)
  return [
    {
      id: "1",
      title: "Summer Sale campaign exceeded target",
      description: "Generated $22,000 in revenue with 450 conversions",
      time: "2 hours ago",
      type: "success",
      icon: "🎉",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "2",
      title: "Brand Awareness campaign needs attention",
      description: "Click-through rate dropped below 2% threshold",
      time: "4 hours ago",
      type: "warning",
      icon: "⚠️",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: "3",
      title: "New audience segment created",
      description: "Mobile users aged 25-34 with high engagement",
      time: "6 hours ago",
      type: "info",
      icon: "👥",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
    {
      id: "4",
      title: "Monthly report generated",
      description: "Performance summary for June 2024 is ready",
      time: "1 day ago",
      type: "info",
      icon: "📊",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ]
}

export const exportReport = async (format: "pdf" | "excel", dateRange: string): Promise<string> => {
  await delay(2000)
  return `report-${dateRange.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.${format}`
}

export const updateCampaignStatus = async (campaignId: string, status: "active" | "paused"): Promise<boolean> => {
  await delay(1000)
  return true
}

export const searchDashboard = async (query: string): Promise<any[]> => {
  await delay(300)

  const allItems = [
    {
      type: "Campaign",
      title: "Summer Sale Campaign",
      description: "Active campaign with high conversion rate",
      icon: "Target",
      gradient: "gradient-green",
    },
    {
      type: "Campaign",
      title: "Brand Awareness",
      description: "Paused campaign focusing on brand visibility",
      icon: "Target",
      gradient: "gradient-orange",
    },
    {
      type: "Campaign",
      title: "Product Launch",
      description: "High-performing product introduction campaign",
      icon: "Target",
      gradient: "gradient-blue",
    },
    {
      type: "Metric",
      title: "Revenue Trends",
      description: "Monthly revenue analysis and forecasting",
      icon: "TrendingUp",
      gradient: "gradient-blue",
    },
    {
      type: "Metric",
      title: "Conversion Rate",
      description: "Track conversion performance across campaigns",
      icon: "MousePointer",
      gradient: "gradient-purple",
    },
    {
      type: "Audience",
      title: "Mobile Users 25-34",
      description: "High-engagement audience segment",
      icon: "Users",
      gradient: "gradient-purple",
    },
    {
      type: "Audience",
      title: "Desktop Users",
      description: "Primary desktop audience analytics",
      icon: "Users",
      gradient: "gradient-green",
    },
    {
      type: "Report",
      title: "Performance Report",
      description: "Comprehensive campaign performance analysis",
      icon: "BarChart3",
      gradient: "gradient-blue",
    },
  ]

  return allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase()),
  )
}
