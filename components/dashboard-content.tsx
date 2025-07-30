"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSign,
  Eye,
  MousePointer,
  TrendingUp,
  Calendar,
  Sparkles,
  Target,
  Users,
  RefreshCw,
  Download,
  Play,
  Pause,
} from "lucide-react"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { exportReport, updateCampaignStatus } from "@/lib/dashboard-api"
import { VoiceAnalytics } from "@/components/voice-analytics"
import { OmnichannelOverview } from "@/components/omnichannel-overview"
import { AdvancedDataTable } from "@/components/advanced-data-table"

interface DashboardContentProps {
  activeSection: string
  onShowToast: (type: "success" | "error" | "info", title: string, message: string) => void
}

export function DashboardContent({ activeSection, onShowToast }: DashboardContentProps) {
  const [dateRange, setDateRange] = useState("Last 30 days")
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [updatingCampaigns, setUpdatingCampaigns] = useState<Set<string>>(new Set())

  const {
    kpiData,
    revenueData,
    campaignData,
    trafficSources,
    deviceData,
    recentActivity,
    loading,
    error,
    refreshData,
  } = useDashboardData(dateRange)

  const handleDateRangeChange = () => {
    console.log("Date range clicked")
    const ranges = ["Last 7 days", "Last 30 days", "Last 90 days", "This year"]
    const currentIndex = ranges.indexOf(dateRange)
    const nextIndex = (currentIndex + 1) % ranges.length
    const newRange = ranges[nextIndex]
    setDateRange(newRange)
    onShowToast("info", "Date Range Changed", `Now showing data for: ${newRange}`)
  }

  const handleRefresh = () => {
    console.log("Refresh clicked")
    refreshData()
    onShowToast("success", "Data Refreshed", "Dashboard data has been updated")
  }

  const handleExport = async (format: "pdf" | "excel" = "pdf") => {
    console.log(`Export clicked: ${format}`)
    try {
      setIsExporting(true)
      const filename = await exportReport(format, dateRange)
      onShowToast("success", "Export Complete", `Report exported as ${filename}`)
    } catch (error) {
      onShowToast("error", "Export Failed", "Failed to export report. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleCampaignStatusToggle = async (campaignId: string, currentStatus: string) => {
    console.log(`Campaign status toggle: ${campaignId} from ${currentStatus}`)
    try {
      setUpdatingCampaigns((prev) => new Set(prev).add(campaignId))
      const newStatus = currentStatus === "active" ? "paused" : "active"
      await updateCampaignStatus(campaignId, newStatus)
      onShowToast(
        "success",
        "Campaign Updated",
        `Campaign ${newStatus === "active" ? "activated" : "paused"} successfully`,
      )
      refreshData()
    } catch (error) {
      onShowToast("error", "Update Failed", "Failed to update campaign status")
    } finally {
      setUpdatingCampaigns((prev) => {
        const newSet = new Set(prev)
        newSet.delete(campaignId)
        return newSet
      })
    }
  }

  const handleCampaignSelect = (campaignId: string) => {
    console.log(`Campaign selected: ${campaignId}`)
    const isSelected = selectedCampaign === campaignId
    setSelectedCampaign(isSelected ? null : campaignId)
    const campaign = campaignData.find((c) => c.id === campaignId)
    if (campaign) {
      onShowToast(
        "info",
        isSelected ? "Campaign Deselected" : "Campaign Selected",
        `${campaign.name} ${isSelected ? "deselected" : "selected"}`,
      )
    }
  }

  const handleKPIClick = (kpiTitle: string) => {
    console.log(`KPI clicked: ${kpiTitle}`)
    onShowToast("info", "KPI Details", `Viewing detailed analytics for ${kpiTitle}`)
  }

  const handleTrafficSourceClick = (sourceName: string) => {
    console.log(`Traffic source clicked: ${sourceName}`)
    onShowToast("info", "Traffic Source", `Analyzing ${sourceName} traffic patterns`)
  }

  const handleDeviceClick = (deviceType: string) => {
    console.log(`Device clicked: ${deviceType}`)
    onShowToast("info", "Device Analytics", `Viewing ${deviceType} user behavior`)
  }

  const handleActivityClick = (activityTitle: string) => {
    console.log(`Activity clicked: ${activityTitle}`)
    onShowToast("info", "Activity Details", `Viewing details: ${activityTitle}`)
  }

  const getIconComponent = (iconName: string) => {
    const icons = {
      DollarSign,
      Eye,
      MousePointer,
      TrendingUp,
    }
    return icons[iconName as keyof typeof icons] || DollarSign
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case "Campaigns":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between animate-slide-in-up">
              <h2 className="text-3xl font-bold text-white gradient-text-animate">Campaign Management</h2>
              <Button
                onClick={() => onShowToast("info", "New Campaign", "Create new campaign dialog would open")}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover-lift button-glow animate-gradient-x hover-bounce"
              >
                Create Campaign
              </Button>
            </div>
            <div className="grid gap-6">
              <Card className="glass-effect border-white/10 rounded-3xl card-entrance hover-lift hover-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 animate-pulse text-purple-400" />
                    Active Campaigns
                  </CardTitle>
                  <CardDescription className="text-purple-300">
                    Manage and monitor your advertising campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-purple-300">Campaign</TableHead>
                        <TableHead className="text-purple-300">Status</TableHead>
                        <TableHead className="text-purple-300">Budget</TableHead>
                        <TableHead className="text-purple-300">Performance</TableHead>
                        <TableHead className="text-purple-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaignData.map((campaign, index) => (
                        <TableRow
                          key={campaign.id}
                          className={`border-white/10 hover:bg-white/5 transition-all duration-300 group/row animate-slide-in-left list-item-${index + 1} ${
                            selectedCampaign === campaign.id
                              ? "bg-purple-500/10 border-purple-500/30 pulse-glow-purple"
                              : ""
                          }`}
                        >
                          <TableCell className="font-medium text-white transition-colors">
                            <button
                              onClick={() => handleCampaignSelect(campaign.id)}
                              className="flex items-center gap-2 text-left w-full p-2 rounded hover:bg-white/5 border-none bg-transparent cursor-pointer hover-scale transition-all duration-300"
                              type="button"
                            >
                              {campaign.name}
                              <div
                                className={`w-2 h-2 rounded-full ${campaign.status === "active" ? "bg-green-400 animate-pulse pulse-glow-green" : "bg-orange-400 animate-pulse"}`}
                              ></div>
                              {selectedCampaign === campaign.id && (
                                <div className="ml-2 text-purple-400 text-xs animate-bounce-x">← Selected</div>
                              )}
                            </button>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={campaign.status === "active" ? "default" : "secondary"}
                              className="animate-fade-in"
                            >
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white">${campaign.spend.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="text-green-400 animate-fade-in">{campaign.conversions} conversions</div>
                              <div className="text-purple-300">
                                {(campaign.revenue / campaign.spend).toFixed(1)}x ROAS
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCampaignStatusToggle(campaign.id, campaign.status)
                                }}
                                disabled={updatingCampaigns.has(campaign.id)}
                                className="h-8 w-8 p-0 text-white hover:bg-white/10 rounded-lg hover-bounce button-press"
                              >
                                {updatingCampaigns.has(campaign.id) ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : campaign.status === "active" ? (
                                  <Pause className="h-4 w-4 icon-pulse" />
                                ) : (
                                  <Play className="h-4 w-4 icon-bounce" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onShowToast("info", "Edit Campaign", `Editing ${campaign.name}`)
                                }}
                                className="h-8 px-3 text-white hover:bg-white/10 rounded-lg hover-wiggle button-press"
                              >
                                Edit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "Analytics":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between animate-slide-in-up">
              <h2 className="text-3xl font-bold text-white gradient-text-animate">Analytics Dashboard</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onShowToast("info", "Filter", "Analytics filters would open")}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover-lift button-glow"
                >
                  Filter Data
                </Button>
                <Button
                  onClick={() => handleExport("excel")}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover-bounce animate-gradient-x"
                >
                  Export Analytics
                </Button>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="glass-effect border-white/10 rounded-3xl card-entrance hover-lift hover-glow stagger-1">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 animate-bounce text-green-400" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription className="text-purple-300">Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Click-through Rate", value: "3.24%", trend: "up" },
                      { label: "Conversion Rate", value: "2.1%", trend: "up" },
                      { label: "Cost per Click", value: "$1.23", trend: "down" },
                      { label: "Quality Score", value: "8.5/10", trend: "up" },
                    ].map((metric, index) => (
                      <button
                        key={metric.label}
                        onClick={() => onShowToast("info", "Metric Details", `Analyzing ${metric.label}`)}
                        className={`w-full flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-all duration-300 border-none bg-transparent cursor-pointer hover-scale animate-slide-in-left stagger-${index + 1}`}
                        type="button"
                      >
                        <span className="text-purple-300">{metric.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{metric.value}</span>
                          {metric.trend === "up" ? (
                            <ArrowUpIcon className="h-4 w-4 text-green-400 animate-bounce" />
                          ) : (
                            <ArrowDownIcon className="h-4 w-4 text-red-400 animate-bounce" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-effect border-white/10 rounded-3xl card-entrance hover-lift hover-glow stagger-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5 animate-pulse text-green-400" />
                    Revenue Analytics
                  </CardTitle>
                  <CardDescription className="text-purple-300">Financial performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Total Revenue", value: "$124,563", change: "+12.5%" },
                      { label: "Average Order Value", value: "$87.20", change: "+5.2%" },
                      { label: "Return on Ad Spend", value: "4.2x", change: "+18.7%" },
                      { label: "Profit Margin", value: "23.4%", change: "+2.1%" },
                    ].map((metric, index) => (
                      <button
                        key={metric.label}
                        onClick={() => onShowToast("info", "Revenue Details", `Analyzing ${metric.label}`)}
                        className={`w-full flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-all duration-300 border-none bg-transparent cursor-pointer hover-scale animate-slide-in-right stagger-${index + 1}`}
                        type="button"
                      >
                        <span className="text-purple-300">{metric.label}</span>
                        <div className="text-right">
                          <div className="text-white font-bold">{metric.value}</div>
                          <div className="text-green-400 text-sm animate-pulse">{metric.change}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Advanced Data Table */}
            <AdvancedDataTable
              data={campaignData.map((campaign, index) => ({
                id: campaign.id,
                name: campaign.name,
                status: campaign.status,
                clicks: campaign.clicks,
                conversions: campaign.conversions,
                spend: campaign.spend,
                revenue: campaign.revenue,
                roas: (campaign.revenue / campaign.spend).toFixed(2),
                ctr: ((campaign.clicks / (campaign.clicks * 20)) * 100).toFixed(2) + "%",
                cpc: (campaign.spend / campaign.clicks).toFixed(2),
                startDate: campaign.startDate,
                endDate: campaign.endDate,
              }))}
              columns={[
                { key: "name", label: "Campaign Name", sortable: true, filterable: true },
                {
                  key: "status",
                  label: "Status",
                  sortable: true,
                  filterable: true,
                  render: (value) => (
                    <Badge
                      variant={value === "active" ? "default" : "secondary"}
                      className={`${
                        value === "active"
                          ? "bg-green-500/20 text-green-200 border-green-400/30"
                          : "bg-orange-500/20 text-orange-200 border-orange-400/30"
                      } animate-fade-in`}
                    >
                      {value}
                    </Badge>
                  ),
                },
                {
                  key: "clicks",
                  label: "Clicks",
                  sortable: true,
                  render: (value) => value.toLocaleString(),
                },
                {
                  key: "conversions",
                  label: "Conversions",
                  sortable: true,
                  render: (value) => <span className="text-green-400 font-medium">{value}</span>,
                },
                {
                  key: "spend",
                  label: "Spend",
                  sortable: true,
                  render: (value) => `$${value.toLocaleString()}`,
                },
                {
                  key: "revenue",
                  label: "Revenue",
                  sortable: true,
                  render: (value) => <span className="text-green-400 font-bold">${value.toLocaleString()}</span>,
                },
                {
                  key: "roas",
                  label: "ROAS",
                  sortable: true,
                  render: (value) => (
                    <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">{value}x</Badge>
                  ),
                },
                { key: "ctr", label: "CTR", sortable: true },
                {
                  key: "cpc",
                  label: "CPC",
                  sortable: true,
                  render: (value) => `$${value}`,
                },
                { key: "startDate", label: "Start Date", sortable: true, filterable: true },
              ]}
              title="Campaign Performance Data"
              description="Comprehensive campaign analytics with sorting, filtering, and pagination"
              onShowToast={onShowToast}
            />
          </div>
        )

      case "Audience":
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-white gradient-text-animate animate-slide-in-up">
              Audience Insights
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { title: "Demographics", description: "Age, gender, location data", icon: "👥" },
                { title: "Interests", description: "User interests and behaviors", icon: "❤️" },
                { title: "Segments", description: "Custom audience segments", icon: "🎯" },
              ].map((item, index) => (
                <Card
                  key={item.title}
                  className={`glass-effect border-white/10 rounded-3xl card-entrance hover-lift hover-glow stagger-${index + 1}`}
                >
                  <CardContent className="p-6">
                    <button
                      onClick={() => onShowToast("info", "Audience", `Viewing ${item.title} data`)}
                      className="w-full text-left border-none bg-transparent cursor-pointer hover-scale transition-all duration-300"
                      type="button"
                    >
                      <div className="text-4xl mb-4 animate-bounce-slow">{item.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-2 text-glow">{item.title}</h3>
                      <p className="text-purple-300">{item.description}</p>
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      case "Voice Analytics":
        return <VoiceAnalytics onShowToast={onShowToast} />

      case "Omnichannel":
        return <OmnichannelOverview onShowToast={onShowToast} />

      default:
        return (
          <>
            {/* Floating Header */}
            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl animate-pulse-slow"></div>
              <div className="relative glass-effect rounded-3xl p-8 border border-white/10 hover-lift">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 animate-slide-in-left">
                      <div className="p-3 rounded-2xl gradient-purple animate-pulse-slow hover-rotate">
                        <Sparkles className="h-6 w-6 text-white animate-bounce-slow" />
                      </div>
                      <div>
                        <h1 className="text-4xl font-bold gradient-text-animate">Dashboard Overview</h1>
                        <p className="text-purple-300 text-lg animate-fade-in">
                          Welcome back! Here's what's happening with your campaigns today.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 animate-slide-in-right">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleDateRangeChange}
                      disabled={loading}
                      className="h-12 px-6 rounded-xl bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-purple-400/50 transition-all duration-300 hover-lift button-glow hover-bounce"
                    >
                      <Calendar className="mr-2 h-5 w-5 text-purple-400 animate-pulse" />
                      <span className="text-white font-medium">{dateRange}</span>
                    </Button>
                    <Button
                      onClick={handleRefresh}
                      disabled={loading}
                      variant="outline"
                      size="lg"
                      className="h-12 px-4 rounded-xl bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-purple-400/50 transition-all duration-300 hover-lift hover-wiggle"
                    >
                      <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : "icon-rotate"}`} />
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => handleExport("pdf")}
                      disabled={isExporting || loading}
                      className="h-12 px-8 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-xl hover-lift button-glow transition-all duration-300 neon-glow disabled:opacity-50 animate-gradient-x hover-jello"
                    >
                      {isExporting ? (
                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <Download className="mr-2 h-5 w-5 animate-bounce" />
                      )}
                      <span className="text-white font-semibold">{isExporting ? "Exporting..." : "Export Report"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className={`glass-effect border-white/10 rounded-2xl shimmer-bg stagger-${i}`}>
                    <CardContent className="p-6">
                      <div className="h-4 bg-white/10 rounded mb-4 animate-pulse"></div>
                      <div className="h-8 bg-white/10 rounded mb-2 animate-pulse"></div>
                      <div className="h-3 bg-white/10 rounded w-2/3 animate-pulse"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* KPI Cards */}
            {!loading && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {kpiData.map((kpi, index) => {
                  const IconComponent = getIconComponent(
                    kpi.title.includes("Revenue")
                      ? "DollarSign"
                      : kpi.title.includes("Impressions")
                        ? "Eye"
                        : kpi.title.includes("Click")
                          ? "MousePointer"
                          : "TrendingUp",
                  )

                  return (
                    <button
                      key={kpi.title}
                      onClick={() => handleKPIClick(kpi.title)}
                      className={`group relative animate-float cursor-pointer border-none bg-transparent p-0 hover-lift hover-glow stagger-${index + 1}`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                      type="button"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-slow"></div>
                      <Card className="relative glass-effect border-white/10 rounded-2xl hover-lift transition-all duration-500 group-hover:neon-glow overflow-hidden card-entrance hover-scale">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16 animate-rotate-slow"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                          <CardTitle className="text-sm font-medium text-purple-200">{kpi.title}</CardTitle>
                          <div className="p-3 rounded-xl gradient-purple shadow-lg group-hover:scale-110 transition-transform duration-300 pulse-glow-purple">
                            <IconComponent className="h-5 w-5 text-white animate-pulse" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-white mb-2 group-hover:scale-105 transition-transform text-glow">
                            {kpi.value}
                          </div>
                          <div className="flex items-center text-sm">
                            {kpi.trend === "up" ? (
                              <ArrowUpIcon className="mr-2 h-4 w-4 text-green-400 animate-bounce" />
                            ) : (
                              <ArrowDownIcon className="mr-2 h-4 w-4 text-red-400 animate-bounce" />
                            )}
                            <span
                              className={`font-semibold ${kpi.trend === "up" ? "text-green-400" : "text-red-400"} animate-pulse`}
                            >
                              {kpi.change}
                            </span>
                            <span className="ml-2 text-purple-300">vs last month</span>
                          </div>
                        </CardContent>
                      </Card>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Charts and Tables */}
            {!loading && (
              <>
                {/* Charts Section */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 animate-fade-in">
                  {/* Revenue Trend Chart */}
                  <div className="col-span-4 relative group animate-slide-in-left">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-slow"></div>
                    <Card className="relative glass-effect border-white/10 rounded-3xl hover-lift transition-all duration-500 overflow-hidden chart-fade-in hover-glow">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 animate-gradient-x"></div>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl gradient-blue pulse-glow-blue">
                              <TrendingUp className="h-5 w-5 text-white animate-bounce" />
                            </div>
                            <div>
                              <CardTitle className="text-xl text-white text-glow">Revenue Trend</CardTitle>
                              <CardDescription className="text-purple-300">
                                Monthly revenue and impressions over time
                              </CardDescription>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onShowToast("info", "Chart Options", "Chart customization options")}
                            className="text-purple-300 hover:text-white hover:bg-white/10 hover-wiggle"
                          >
                            Options
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={{
                            revenue: {
                              label: "Revenue",
                              color: "hsl(var(--chart-1))",
                            },
                          }}
                          className="h-[300px] chart-scale-in"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                              <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="month" stroke="#a855f7" />
                              <YAxis stroke="#a855f7" />
                              <ChartTooltip
                                content={<ChartTooltipContent className="glass-effect border-white/10" />}
                              />
                              <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                fill="url(#revenueGradient)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Traffic Sources Pie Chart */}
                  <div className="col-span-3 relative group animate-slide-in-right">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-slow"></div>
                    <Card className="relative glass-effect border-white/10 rounded-3xl hover-lift transition-all duration-500 overflow-hidden chart-fade-in hover-glow">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 animate-gradient-x"></div>
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl gradient-orange">
                            <Target className="h-5 w-5 text-white animate-pulse" />
                          </div>
                          <div>
                            <CardTitle className="text-xl text-white text-glow">Traffic Sources</CardTitle>
                            <CardDescription className="text-purple-300">
                              Distribution of traffic by platform
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={{
                            value: {
                              label: "Percentage",
                            },
                          }}
                          className="h-[200px] chart-scale-in"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={trafficSources}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {trafficSources.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <ChartTooltip
                                content={<ChartTooltipContent className="glass-effect border-white/10" />}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                        <div className="mt-6 space-y-3">
                          {trafficSources.map((source, index) => (
                            <button
                              key={source.name}
                              onClick={() => handleTrafficSourceClick(source.name)}
                              className={`w-full flex items-center justify-between text-sm group/item hover:bg-white/5 p-2 rounded-lg transition-all duration-300 cursor-pointer border-none bg-transparent hover-scale animate-slide-in-up stagger-${index + 1}`}
                              type="button"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="h-4 w-4 rounded-full shadow-lg animate-pulse-slow hover-bounce"
                                  style={{ backgroundColor: source.color, animationDelay: `${index * 0.2}s` }}
                                />
                                <span className="text-white font-medium">{source.name}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-purple-300">{source.value}%</div>
                                <div className="text-xs text-purple-400 animate-fade-in">
                                  {source.sessions.toLocaleString()} sessions
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Campaign Performance & Device Analytics */}
                <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
                  {/* Campaign Performance Table */}
                  <div className="relative group animate-slide-in-left">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-slow"></div>
                    <Card className="relative glass-effect border-white/10 rounded-3xl hover-lift transition-all duration-500 overflow-hidden hover-glow">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 animate-gradient-x"></div>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl gradient-green pulse-glow-green">
                              <Target className="h-5 w-5 text-white animate-pulse" />
                            </div>
                            <div>
                              <CardTitle className="text-xl text-white text-glow">Top Campaigns</CardTitle>
                              <CardDescription className="text-purple-300">
                                Performance metrics for your active campaigns
                              </CardDescription>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onShowToast("info", "Campaign Details", "View all campaigns")}
                            className="text-purple-300 hover:text-white hover:bg-white/10 hover-bounce"
                          >
                            View All
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow className="border-white/10 hover:bg-white/5">
                              <TableHead className="text-purple-300 font-semibold">Campaign</TableHead>
                              <TableHead className="text-purple-300 font-semibold">Clicks</TableHead>
                              <TableHead className="text-purple-300 font-semibold">Conv.</TableHead>
                              <TableHead className="text-purple-300 font-semibold">ROAS</TableHead>
                              <TableHead className="text-purple-300 font-semibold">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {campaignData.map((campaign, index) => (
                              <TableRow
                                key={campaign.id}
                                className={`border-white/10 hover:bg-white/5 transition-all duration-300 group/row animate-slide-in-left list-item-${index + 1} ${
                                  selectedCampaign === campaign.id
                                    ? "bg-purple-500/10 border-purple-500/30 pulse-glow-purple"
                                    : ""
                                }`}
                              >
                                <TableCell className="font-medium text-white transition-colors">
                                  <button
                                    onClick={() => handleCampaignSelect(campaign.id)}
                                    className="flex items-center gap-2 text-left w-full p-2 rounded hover:bg-white/5 border-none bg-transparent cursor-pointer hover-scale transition-all duration-300"
                                    type="button"
                                  >
                                    {campaign.name}
                                    <div
                                      className={`w-2 h-2 rounded-full ${campaign.status === "active" ? "bg-green-400 animate-pulse pulse-glow-green" : "bg-orange-400 animate-pulse"}`}
                                    ></div>
                                    {selectedCampaign === campaign.id && (
                                      <div className="ml-2 text-purple-400 text-xs animate-bounce-x">← Selected</div>
                                    )}
                                  </button>
                                </TableCell>
                                <TableCell className="text-purple-200 animate-fade-in">
                                  {campaign.clicks.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-purple-200 animate-fade-in">
                                  {campaign.conversions}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="secondary"
                                    className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border-purple-400/30 hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300 animate-gradient-x"
                                  >
                                    {(campaign.revenue / campaign.spend).toFixed(1)}x
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleCampaignStatusToggle(campaign.id, campaign.status)
                                    }}
                                    disabled={updatingCampaigns.has(campaign.id)}
                                    className="h-8 w-8 p-0 text-white hover:bg-white/10 rounded-lg hover-bounce button-press"
                                  >
                                    {updatingCampaigns.has(campaign.id) ? (
                                      <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : campaign.status === "active" ? (
                                      <Pause className="h-4 w-4 icon-pulse" />
                                    ) : (
                                      <Play className="h-4 w-4 icon-bounce" />
                                    )}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Device Performance */}
                  <div className="relative group animate-slide-in-right">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-slow"></div>
                    <Card className="relative glass-effect border-white/10 rounded-3xl hover-lift transition-all duration-500 overflow-hidden hover-glow">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-gradient-x"></div>
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl gradient-blue pulse-glow-blue">
                            <Users className="h-5 w-5 text-white animate-pulse" />
                          </div>
                          <div>
                            <CardTitle className="text-xl text-white text-glow">Device Performance</CardTitle>
                            <CardDescription className="text-purple-300">
                              Sessions and conversions by device type
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {deviceData.map((device, index) => (
                          <button
                            key={device.device}
                            onClick={() => handleDeviceClick(device.device)}
                            className={`w-full space-y-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group/device cursor-pointer border-none text-left hover-scale animate-slide-in-up stagger-${index + 1}`}
                            type="button"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl animate-bounce-slow">{device.icon}</span>
                                <span className="font-semibold text-white">{device.device}</span>
                              </div>
                              <span className="text-purple-300 font-medium animate-fade-in">
                                {device.sessions.toLocaleString()} sessions
                              </span>
                            </div>
                            <Progress
                              value={(device.conversions / device.sessions) * 100 * 10}
                              className="h-3 bg-white/10 progress-shimmer"
                            />
                            <div className="flex justify-between text-sm">
                              <span className="text-green-400 font-medium animate-pulse">
                                {device.conversions} conversions
                              </span>
                              <span className="text-purple-300">
                                {((device.conversions / device.sessions) * 100).toFixed(2)}% rate
                              </span>
                            </div>
                          </button>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="relative group animate-fade-in">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-slow"></div>
                  <Card className="relative glass-effect border-white/10 rounded-3xl hover-lift transition-all duration-500 overflow-hidden hover-glow">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient-x"></div>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl gradient-purple animate-pulse-slow hover-rotate">
                            <Sparkles className="h-5 w-5 text-white animate-bounce" />
                          </div>
                          <div>
                            <CardTitle className="text-xl text-white text-glow">Recent Activity</CardTitle>
                            <CardDescription className="text-purple-300">
                              Latest updates from your campaigns and analytics
                            </CardDescription>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onShowToast("info", "Activity Feed", "View all activity")}
                          className="text-purple-300 hover:text-white hover:bg-white/10 hover-wiggle"
                        >
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                          <button
                            key={activity.id}
                            onClick={() => handleActivityClick(activity.title)}
                            className={`w-full flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group/activity hover-lift cursor-pointer border-none text-left hover-scale animate-slide-in-up stagger-${index + 1}`}
                            type="button"
                          >
                            <div className="flex-shrink-0">
                              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/10 animate-pulse-slow">
                                <span className="text-lg animate-bounce-slow">{activity.icon}</span>
                              </div>
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="font-semibold text-white text-glow">{activity.title}</p>
                              <p className="text-sm text-purple-300 animate-fade-in">{activity.description}</p>
                              <p className="text-xs text-purple-400">{activity.time}</p>
                            </div>
                            <div
                              className={`mt-2 h-3 w-3 rounded-full animate-pulse ${
                                activity.type === "success"
                                  ? "bg-green-400 pulse-glow-green"
                                  : activity.type === "warning"
                                    ? "bg-yellow-400"
                                    : "bg-blue-400 pulse-glow-blue"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </>
        )
    }
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 animate-fade-in">
        <Card className="glass-effect border-white/10 rounded-2xl p-8 text-center hover-lift">
          <CardContent>
            <div className="text-red-400 mb-4 text-4xl animate-bounce">⚠️</div>
            <h3 className="text-xl font-semibold text-white mb-2 text-glow">Error Loading Dashboard</h3>
            <p className="text-purple-300 mb-4 animate-fade-in">{error}</p>
            <Button onClick={handleRefresh} className="gradient-purple hover-bounce animate-gradient-x">
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="flex-1 space-y-8 p-6 bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-slate-900/50 morph-bg">
      {renderSectionContent()}
    </main>
  )
}
