"use client"

import { useState, useEffect } from "react"
import {
  fetchKPIData,
  fetchRevenueData,
  fetchCampaignData,
  fetchTrafficSources,
  fetchDeviceData,
  fetchRecentActivity,
  type KPIData,
  type RevenueData,
  type CampaignData,
  type TrafficSource,
  type DeviceData,
  type ActivityItem,
} from "@/lib/dashboard-api"

export function useDashboardData(dateRange: string) {
  const [kpiData, setKpiData] = useState<KPIData[]>([])
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [campaignData, setCampaignData] = useState<CampaignData[]>([])
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([])
  const [deviceData, setDeviceData] = useState<DeviceData[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [kpi, revenue, campaigns, traffic, devices, activity] = await Promise.all([
          fetchKPIData(dateRange),
          fetchRevenueData(dateRange),
          fetchCampaignData(),
          fetchTrafficSources(),
          fetchDeviceData(),
          fetchRecentActivity(),
        ])

        setKpiData(kpi)
        setRevenueData(revenue)
        setCampaignData(campaigns)
        setTrafficSources(traffic)
        setDeviceData(devices)
        setRecentActivity(activity)
      } catch (err) {
        setError("Failed to load dashboard data")
        console.error("Dashboard data loading error:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [dateRange])

  const refreshData = () => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [kpi, revenue, campaigns, traffic, devices, activity] = await Promise.all([
          fetchKPIData(dateRange),
          fetchRevenueData(dateRange),
          fetchCampaignData(),
          fetchTrafficSources(),
          fetchDeviceData(),
          fetchRecentActivity(),
        ])

        setKpiData(kpi)
        setRevenueData(revenue)
        setCampaignData(campaigns)
        setTrafficSources(traffic)
        setDeviceData(devices)
        setRecentActivity(activity)
      } catch (err) {
        setError("Failed to refresh dashboard data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }

  return {
    kpiData,
    revenueData,
    campaignData,
    trafficSources,
    deviceData,
    recentActivity,
    loading,
    error,
    refreshData,
  }
}
