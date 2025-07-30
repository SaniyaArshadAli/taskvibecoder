"use client"

import { Bell, Search, User, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useState } from "react"
import { SearchResults } from "@/components/search-results"
import { searchDashboard } from "@/lib/dashboard-api"
import { VoiceSearch } from "@/components/voice-search"
import { ThemeToggle } from "@/components/theme-toggle"
import { SmartFilters } from "@/components/smart-filters"

interface DashboardHeaderProps {
  onShowToast: (type: "success" | "error" | "info", title: string, message: string) => void
}

export function DashboardHeader({ onShowToast }: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState(3)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await searchDashboard(query)
      setSearchResults(results)
    } catch (error) {
      console.error("Search failed:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleNotificationClick = () => {
    console.log("Notification clicked") // Debug log
    setNotifications(0)
    onShowToast("info", "Notifications", "All notifications have been marked as read")
  }

  const handleUpgradeClick = () => {
    console.log("Upgrade clicked") // Debug log
    onShowToast("info", "Upgrade", "Redirecting to upgrade page...")
    setTimeout(() => {
      alert("This would redirect to the upgrade page!")
    }, 1000)
  }

  const handleProfileClick = (action: string) => {
    console.log(`Profile action clicked: ${action}`) // Debug log
    onShowToast("info", "Profile", `${action} clicked`)
    if (action === "Sign out") {
      setTimeout(() => {
        alert("This would sign you out!")
      }, 1000)
    }
  }

  const handleSearchResultSelect = (result: any) => {
    onShowToast("success", "Search Result", `Selected: ${result.title}`)
    setSearchQuery("")
    setIsSearchFocused(false)
    setSearchResults([])
  }

  return (
    <header className="flex h-20 items-center gap-4 border-b border-white/10 glass-effect px-6">
      <SidebarTrigger className="text-white hover:text-purple-300 transition-colors" />

      <div className="flex-1 max-w-md relative">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-300 group-focus-within:text-purple-400 transition-colors" />
          <Input
            placeholder="Search campaigns, metrics, reports..."
            value={searchQuery}
            onChange={(e) => {
              console.log(`Search query: ${e.target.value}`)
              setSearchQuery(e.target.value)
              handleSearch(e.target.value)
            }}
            onFocus={() => {
              console.log("Search focused")
              setIsSearchFocused(true)
            }}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl h-12 transition-all duration-300 focus:neon-glow"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
        <SearchResults
          query={searchQuery}
          results={searchResults}
          isLoading={isSearching}
          isVisible={isSearchFocused && searchQuery.length > 0}
          onResultSelect={handleSearchResultSelect}
          onClose={() => {
            setSearchQuery("")
            setIsSearchFocused(false)
            setSearchResults([])
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        <SmartFilters
          onFiltersChange={(filters) => console.log("Filters changed:", filters)}
          onShowToast={onShowToast}
        />

        <VoiceSearch
          onVoiceCommand={(command) => {
            console.log("Voice command:", command)
            onShowToast("info", "Voice Command", `Processing: "${command}"`)
          }}
          onShowToast={onShowToast}
        />

        <ThemeToggle onShowToast={onShowToast} />

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNotificationClick}
          className="relative h-12 w-12 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-purple-500/20 hover:border-purple-400/30 transition-all duration-300 hover-lift button-glow group"
        >
          <Bell className="h-5 w-5 group-hover:animate-bounce" />
          {notifications > 0 && (
            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-red-400 to-pink-400 animate-pulse flex items-center justify-center text-xs font-bold">
              {notifications}
            </div>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 text-white hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300 hover-lift neon-glow button-glow group"
            >
              <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-effect border-white/10 text-white min-w-48">
            <DropdownMenuLabel className="text-purple-300">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={() => handleProfileClick("Profile")}
              className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-white"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleProfileClick("Settings")}
              className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-white"
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={() => handleProfileClick("Sign out")}
              className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-white"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={handleUpgradeClick}
          size="sm"
          className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-lg hover-lift button-glow transition-all duration-300 neon-glow"
        >
          <Zap className="mr-2 h-4 w-4 animate-pulse" />
          <span className="text-white font-semibold">Upgrade Pro</span>
        </Button>
      </div>
    </header>
  )
}
