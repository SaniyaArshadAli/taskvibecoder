"use client"

import {
  BarChart3,
  Calendar,
  DollarSign,
  Home,
  MousePointer,
  PieChart,
  Settings,
  Target,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const navigationItems = [
    {
      title: "Overview",
      icon: Home,
      gradient: "gradient-purple",
    },
    {
      title: "Campaigns",
      icon: Target,
      gradient: "gradient-blue",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      gradient: "gradient-green",
    },
    {
      title: "Audience",
      icon: Users,
      gradient: "gradient-orange",
    },
    {
      title: "Conversions",
      icon: MousePointer,
      gradient: "gradient-purple",
    },
    {
      title: "Revenue",
      icon: DollarSign,
      gradient: "gradient-green",
    },
    {
      title: "Voice Analytics",
      icon: Sparkles,
      gradient: "gradient-purple",
    },
    {
      title: "Omnichannel",
      icon: TrendingUp,
      gradient: "gradient-blue",
    },
  ]

  const reportItems = [
    {
      title: "Performance",
      icon: TrendingUp,
      gradient: "gradient-blue",
    },
    {
      title: "Demographics",
      icon: PieChart,
      gradient: "gradient-orange",
    },
    {
      title: "Schedule",
      icon: Calendar,
      gradient: "gradient-purple",
    },
  ]

  const handleSettingsClick = () => {
    alert("Settings panel would open here!")
  }

  return (
    <Sidebar className="border-r border-white/10 glass-effect">
      <SidebarHeader className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl gradient-purple neon-glow animate-pulse-slow">
            <Sparkles className="h-5 w-5 text-white animate-bounce-slow" />
            <div className="absolute inset-0 rounded-xl gradient-purple opacity-50 animate-ping"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              ADmyBRAND
            </span>
            <span className="text-sm text-purple-300 font-medium">Insights</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-purple-300 font-semibold mb-3">Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <button
                    onClick={() => {
                      onSectionChange(item.title)
                      console.log(`Clicked: ${item.title}`) // Debug log
                    }}
                    className={`
                      w-full group relative overflow-hidden rounded-xl transition-all duration-300 hover-lift cursor-pointer
                      ${
                        activeSection === item.title
                          ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 neon-glow"
                          : "hover:bg-white/5 hover:border-white/10 border border-transparent"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 p-3 w-full text-left">
                      <div className={`p-2 rounded-lg ${item.gradient} shadow-lg`}>
                        <item.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-white">{item.title}</span>
                      {activeSection === item.title && (
                        <div className="absolute right-2 w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                      )}
                    </div>
                  </button>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-purple-300 font-semibold mb-3">Reports</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {reportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <button
                    onClick={() => {
                      onSectionChange(item.title)
                      console.log(`Clicked report: ${item.title}`) // Debug log
                    }}
                    className="w-full group relative overflow-hidden rounded-xl transition-all duration-300 hover-lift hover:bg-white/5 hover:border-white/10 border border-transparent cursor-pointer"
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div className={`p-2 rounded-lg ${item.gradient} shadow-lg`}>
                        <item.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-white">{item.title}</span>
                    </div>
                  </button>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <button
              onClick={() => {
                handleSettingsClick()
                console.log("Settings clicked") // Debug log
              }}
              className="w-full group relative overflow-hidden rounded-xl transition-all duration-300 hover-lift hover:bg-white/5 hover:border-white/10 border border-transparent cursor-pointer"
            >
              <div className="flex items-center gap-3 p-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 shadow-lg">
                  <Settings className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-white">Settings</span>
              </div>
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
