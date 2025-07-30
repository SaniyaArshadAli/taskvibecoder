"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mic, Volume2, TrendingUp, Users, MessageSquare, BarChart3 } from "lucide-react"

interface VoiceAnalyticsProps {
  onShowToast: (type: "success" | "error" | "info", title: string, message: string) => void
}

export function VoiceAnalytics({ onShowToast }: VoiceAnalyticsProps) {
  const [voiceMetrics] = useState({
    totalVoiceSearches: 12847,
    voiceConversions: 2156,
    avgVoiceSessionDuration: "3:24",
    topVoiceQueries: [
      { query: "best running shoes", volume: 1250, sentiment: "positive" },
      { query: "affordable laptops", volume: 980, sentiment: "neutral" },
      { query: "pizza delivery near me", volume: 856, sentiment: "positive" },
      { query: "weather forecast", volume: 742, sentiment: "neutral" },
      { query: "movie tickets", volume: 634, sentiment: "positive" },
    ],
    voiceDevices: [
      { device: "Smart Speakers", percentage: 45, sessions: 5781 },
      { device: "Mobile Voice", percentage: 35, sessions: 4496 },
      { device: "Car Assistant", percentage: 20, sessions: 2570 },
    ],
    sentimentAnalysis: {
      positive: 68,
      neutral: 24,
      negative: 8,
    },
  })

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-400"
      case "negative":
        return "text-red-400"
      default:
        return "text-yellow-400"
    }
  }

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500/20 border-green-400/30"
      case "negative":
        return "bg-red-500/20 border-red-400/30"
      default:
        return "bg-yellow-500/20 border-yellow-400/30"
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 animate-slide-in-up">
        <div className="p-2 rounded-xl gradient-purple pulse-glow-purple">
          <Volume2 className="h-5 w-5 text-white animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white gradient-text-animate">Voice Analytics</h2>
          <p className="text-purple-300">Voice search insights and audio campaign performance</p>
        </div>
      </div>

      {/* Voice Metrics Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-effect border-white/10 rounded-2xl hover-lift card-entrance stagger-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-purple-300">Voice Searches</CardTitle>
              <Mic className="h-4 w-4 text-purple-400 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">{voiceMetrics.totalVoiceSearches.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-400">
              <TrendingUp className="h-3 w-3 mr-1 animate-bounce" />
              +23.5% vs last month
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/10 rounded-2xl hover-lift card-entrance stagger-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-purple-300">Voice Conversions</CardTitle>
              <Users className="h-4 w-4 text-green-400 animate-bounce" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">{voiceMetrics.voiceConversions.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-400">
              <TrendingUp className="h-3 w-3 mr-1 animate-bounce" />
              +18.2% conversion rate
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/10 rounded-2xl hover-lift card-entrance stagger-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-purple-300">Avg Session</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-400 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">{voiceMetrics.avgVoiceSessionDuration}</div>
            <div className="flex items-center text-sm text-blue-400">
              <TrendingUp className="h-3 w-3 mr-1 animate-bounce" />
              +12% engagement
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/10 rounded-2xl hover-lift card-entrance stagger-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-purple-300">Sentiment Score</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-400 animate-bounce" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400 mb-1">{voiceMetrics.sentimentAnalysis.positive}%</div>
            <div className="text-sm text-purple-300">Positive sentiment</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Voice Queries */}
        <Card className="glass-effect border-white/10 rounded-3xl hover-lift hover-glow animate-slide-in-left">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mic className="h-5 w-5 animate-pulse text-purple-400" />
              Top Voice Queries
            </CardTitle>
            <CardDescription className="text-purple-300">Most searched voice commands</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {voiceMetrics.topVoiceQueries.map((query, index) => (
              <div
                key={query.query}
                className={`flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 animate-slide-in-up stagger-${index + 1}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">"{query.query}"</span>
                    <Badge variant="secondary" className={getSentimentBg(query.sentiment)}>
                      {query.sentiment}
                    </Badge>
                  </div>
                  <div className="text-sm text-purple-300">{query.volume.toLocaleString()} searches</div>
                </div>
                <div className={`text-lg ${getSentimentColor(query.sentiment)} animate-pulse`}>
                  {query.sentiment === "positive" ? "😊" : query.sentiment === "negative" ? "😞" : "😐"}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Voice Device Distribution */}
        <Card className="glass-effect border-white/10 rounded-3xl hover-lift hover-glow animate-slide-in-right">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Volume2 className="h-5 w-5 animate-bounce text-blue-400" />
              Voice Device Usage
            </CardTitle>
            <CardDescription className="text-purple-300">Distribution across voice-enabled devices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {voiceMetrics.voiceDevices.map((device, index) => (
              <div key={device.device} className={`space-y-2 animate-slide-in-up stagger-${index + 1}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{device.device}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-purple-300">{device.percentage}%</div>
                    <div className="text-xs text-purple-400">{device.sessions.toLocaleString()} sessions</div>
                  </div>
                </div>
                <Progress value={device.percentage} className="h-2 bg-white/10 progress-shimmer" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Analysis */}
      <Card className="glass-effect border-white/10 rounded-3xl hover-lift hover-glow animate-fade-in">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 animate-pulse text-green-400" />
            Voice Sentiment Analysis
          </CardTitle>
          <CardDescription className="text-purple-300">
            Emotional analysis of voice interactions and queries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-400/30 hover-scale animate-slide-in-up stagger-1">
              <div className="text-3xl mb-2 animate-bounce-slow">😊</div>
              <div className="text-2xl font-bold text-green-400 mb-1">{voiceMetrics.sentimentAnalysis.positive}%</div>
              <div className="text-sm text-green-300">Positive</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-yellow-500/10 border border-yellow-400/30 hover-scale animate-slide-in-up stagger-2">
              <div className="text-3xl mb-2 animate-bounce-slow">😐</div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">{voiceMetrics.sentimentAnalysis.neutral}%</div>
              <div className="text-sm text-yellow-300">Neutral</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-red-500/10 border border-red-400/30 hover-scale animate-slide-in-up stagger-3">
              <div className="text-3xl mb-2 animate-bounce-slow">😞</div>
              <div className="text-2xl font-bold text-red-400 mb-1">{voiceMetrics.sentimentAnalysis.negative}%</div>
              <div className="text-sm text-red-300">Negative</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
