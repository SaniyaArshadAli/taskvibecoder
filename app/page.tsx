"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardContent } from "@/components/dashboard-content"
import { ParticleBackground } from "@/components/particle-background"
import { NotificationToast } from "@/components/notification-toast"
import { TeamChat } from "@/components/team-chat"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("Overview")
  const [toasts, setToasts] = useState<
    Array<{
      id: string
      type: "success" | "error" | "info"
      title: string
      message: string
    }>
  >([])

  const addToast = (type: "success" | "error" | "info", title: string, message: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, type, title, message }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <ParticleBackground />
      <NotificationToast toasts={toasts} onRemove={removeToast} />
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          <div className="flex-1 flex flex-col">
            <DashboardHeader onShowToast={addToast} />
            <DashboardContent activeSection={activeSection} onShowToast={addToast} />
          </div>
        </div>
      </SidebarProvider>
      <TeamChat onShowToast={addToast} />
    </div>
  )
}
