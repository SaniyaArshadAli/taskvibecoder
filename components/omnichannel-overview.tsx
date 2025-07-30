"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Tv, Smartphone, Mail, MessageCircle, TrendingUp, Users, Target, Globe, Zap } from "lucide-react"

interface OmnichannelOverviewProps {
  onShowToast: (type: "success" | "error" | "info", title: string, message: string) => void
}

export function OmnichannelOverview({ onShowToast }: OmnichannelOverviewProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")

  const channelData = [
    {
      channel: "Google Ads",
      icon: Globe,
      spend: 45000,
      impressions: 2400000,
      clicks: 48000,
      conversions: 1200,
      roas: 4.2,
      color: "#4285f4",
      trend: "+12%",
      status: "active",
    },
    {
      channel: "Facebook",
      icon: Users,
      spend: 32000,
      impressions: 1800000,
      clicks: 36000,
      conversions: 890,
      roas: 3.8,
      color: "#1877f2",
      trend: "+8%",
      status: "active",
    },
    {
      channel: "Instagram",
      icon: Smartphone,
      spend: 28000,
      impressions: 1500000,
      clicks: 32000,
      conversions: 750,
      roas: 3.5,
      color: "#e4405f",
      trend: "+15%",
      status: "active",
    },
    {
      channel: "YouTube",
      icon: Tv,
      spend: 38000,
      impressions: 2100000,
      clicks: 42000,
      conversions: 980,
      roas: 3.9,
      color: "#ff0000",
      trend: "+6%",
      status: "active",
    },
    {
      channel: "LinkedIn",
      icon: Users,
      spend: 22000,
      impressions: 800000,
      clicks: 18000,
      conversions: 420,
      roas: 2.8,
      color: "#0077b5",
      trend: "+3%",
      status: "active",
    },
    {
      channel: "TikTok",
      icon: Smartphone,
      spend: 18000,
      impressions: 1200000,
      clicks: 28000,
      conversions: 580,
      roas: 4.1,
      color: "#000000",
      trend: "+25%",
      status: "active",
    },
    {
      channel: "Email",
      icon: Mail,
      spend: 5000,
      impressions: 500000,
      clicks: 15000,
      conversions: 380,
      roas: 6.2,
      color: "#34d399",
      trend: "+18%",
      status: "active",
    },
    {
      channel: "SMS",
      icon: MessageCircle,
      spend: 3000,
      impressions: 200000,
      clicks: 8000,
      conversions: 160,
      roas: 5.8,
      color: "#fbbf24",
      trend: "+22%",
      status: "active",
    },
  ]

  const performanceData = [
    { name: "Mon", google: 4000, facebook: 2400, instagram: 2000, youtube: 3200 },
    { name: "Tue", google: 3000, facebook: 1398, instagram: 2210, youtube: 2800 },
    { name: "Wed", google: 2000, facebook: 9800, instagram: 2290, youtube: 3400 },
    { name: "Thu", google: 2780, facebook: 3908, instagram: 2000, youtube: 2900 },
    { name: "Fri", google: 1890, facebook: 4800, instagram: 2181, youtube: 3100 },
    { name: "Sat", google: 2390, facebook: 3800, instagram: 2500, youtube: 3300 },
    { name: "Sun", google: 3490, facebook: 4300, instagram: 2100, youtube: 3600 },
  ]

  const handleChannelClick = (channel: string) => {
    onShowToast("info", "Channel Details", `Viewing detailed analytics for ${channel}`)
  }

  const handleOptimizeClick = (channel: string) => {
    onShowToast("success", "Optimization", `AI optimization suggestions for ${channel} have been generated`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between animate-slide-in-up">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl gradient-blue pulse-glow-blue">
            <Target className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white gradient-text-animate">Omnichannel Overview</h2>
            <p className="text-purple-300">Cross-platform campaign performance and insights</p>
          </div>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d"].map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedTimeframe(timeframe)
                onShowToast("info", "Timeframe Changed", `Now showing ${timeframe} data`)
              }}
              className={`h-8 px-3 rounded-lg transition-all duration-300 hover-bounce ${
                selectedTimeframe === timeframe
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "bg-white/5 border-white/20 text-white hover:bg-white/10"
              }`}
            >
              {timeframe}
            </Button>
          ))}
        </div>
      </div>

      {/* Channel Performance Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {channelData.map((channel, index) => {
          const IconComponent = channel.icon
          return (
            <Card
              key={channel.channel}
              className={`glass-effect border-white/10 rounded-2xl hover-lift hover-glow cursor-pointer transition-all duration-300 card-entrance stagger-${(index % 4) + 1}`}
              onClick={() => handleChannelClick(channel.channel)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="p-2 rounded-lg shadow-lg animate-pulse-slow"
                      style={{ backgroundColor: `${channel.color}20`, border: `1px solid ${channel.color}40` }}
                    >
                      <IconComponent className="h-4 w-4" style={{ color: channel.color }} />
                    </div>
                    <div>
                      <CardTitle className="text-sm text-white">{channel.channel}</CardTitle>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-green-500/20 text-green-200 border-green-400/30 animate-fade-in"
                      >
                        {channel.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-green-400 font-medium animate-bounce">{channel.trend}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-purple-300">Spend</div>
                    <div className="font-bold text-white">${(channel.spend / 1000).toFixed(0)}k</div>
                  </div>
                  <div>
                    <div className="text-purple-300">ROAS</div>
                    <div className="font-bold text-white">{channel.roas}x</div>
                  </div>
                  <div>
                    <div className="text-purple-300">Clicks</div>
                    <div className="font-bold text-white">{(channel.clicks / 1000).toFixed(0)}k</div>
                  </div>
                  <div>
                    <div className="text-purple-300">Conv.</div>
                    <div className="font-bold text-white">{channel.conversions}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOptimizeClick(channel.channel)
                  }}
                  className="w-full h-7 text-xs bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 text-white hover:from-purple-500/30 hover:to-blue-500/30 hover-bounce"
                >
                  <Zap className="h-3 w-3 mr-1 animate-pulse" />
                  AI Optimize
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Performance Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Channel Performance Comparison */}
        <Card className="glass-effect border-white/10 rounded-3xl hover-lift hover-glow animate-slide-in-left overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart className="h-5 w-5 animate-bounce text-blue-400" />
              Channel Performance
            </CardTitle>
            <CardDescription className="text-purple-300">Daily performance across top channels</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                google: { label: "Google", color: "#4285f4" },
                facebook: { label: "Facebook", color: "#1877f2" },
                instagram: { label: "Instagram", color: "#e4405f" },
                youtube: { label: "YouTube", color: "#ff0000" },
              }}
              className="h-[280px] chart-fade-in"
            >
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#a855f7" />
                  <YAxis stroke="#a855f7" />
                  <ChartTooltip content={<ChartTooltipContent className="glass-effect border-white/10" />} />
                  <Bar dataKey="google" fill="#4285f4" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="facebook" fill="#1877f2" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="instagram" fill="#e4405f" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="youtube" fill="#ff0000" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Cross-Channel Attribution */}
        <Card className="glass-effect border-white/10 rounded-3xl hover-lift hover-glow animate-slide-in-right">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 animate-pulse text-green-400" />
              Attribution Analysis
            </CardTitle>
            <CardDescription className="text-purple-300">Customer journey across channels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { path: "Google → Facebook → Conversion", conversions: 450, value: "$18,000" },
              { path: "Instagram → YouTube → Conversion", conversions: 320, value: "$12,800" },
              { path: "Email → Google → Conversion", conversions: 280, value: "$11,200" },
              { path: "TikTok → Instagram → Conversion", conversions: 190, value: "$7,600" },
            ].map((attribution, index) => (
              <div
                key={attribution.path}
                className={`p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 animate-slide-in-up stagger-${index + 1}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{attribution.path}</span>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                    {attribution.conversions} conv.
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-purple-300">Attribution Value</span>
                  <span className="font-bold text-green-400">{attribution.value}</span>
                </div>
                <Progress
                  value={(attribution.conversions / 450) * 100}
                  className="h-1 mt-2 bg-white/10 progress-shimmer"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Channel Insights */}
      <Card className="glass-effect border-white/10 rounded-3xl hover-lift hover-glow animate-fade-in">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 animate-bounce text-yellow-400" />
            AI-Powered Channel Insights
          </CardTitle>
          <CardDescription className="text-purple-300">
            Smart recommendations for cross-channel optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Budget Reallocation",
                insight: "Move 15% budget from LinkedIn to TikTok for +23% ROAS improvement",
                impact: "High",
                color: "green",
              },
              {
                title: "Audience Overlap",
                insight: "32% audience overlap between Facebook and Instagram campaigns",
                impact: "Medium",
                color: "yellow",
              },
              {
                title: "Creative Fatigue",
                insight: "YouTube ad creative showing 18% performance decline",
                impact: "High",
                color: "red",
              },
              {
                title: "Cross-Channel Synergy",
                insight: "Email + Google Ads combo shows 2.3x higher conversion rate",
                impact: "High",
                color: "green",
              },
              {
                title: "Timing Optimization",
                insight: "Instagram performs 40% better on weekends",
                impact: "Medium",
                color: "blue",
              },
              {
                title: "Device Targeting",
                insight: "Mobile-first approach recommended for TikTok campaigns",
                impact: "Medium",
                color: "blue",
              },
            ].map((insight, index) => (
              <div
                key={insight.title}
                className={`p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer hover-scale animate-slide-in-up stagger-${(index % 3) + 1}`}
                onClick={() => onShowToast("info", "Insight Details", insight.insight)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white text-sm">{insight.title}</h4>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      insight.color === "green"
                        ? "bg-green-500/20 text-green-200 border-green-400/30"
                        : insight.color === "yellow"
                          ? "bg-yellow-500/20 text-yellow-200 border-yellow-400/30"
                          : insight.color === "red"
                            ? "bg-red-500/20 text-red-200 border-red-400/30"
                            : "bg-blue-500/20 text-blue-200 border-blue-400/30"
                    }`}
                  >
                    {insight.impact}
                  </Badge>
                </div>
                <p className="text-xs text-purple-300 leading-relaxed">{insight.insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
