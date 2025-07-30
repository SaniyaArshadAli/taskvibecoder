"use client"

import { useState } from "react"
import { Filter, Calendar, Target, Tv, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

interface SmartFiltersProps {
  onFiltersChange: (filters: any) => void
  onShowToast: (type: "success" | "error" | "info", title: string, message: string) => void
}

export function SmartFilters({ onFiltersChange, onShowToast }: SmartFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<{
    dateRange: string[]
    channels: string[]
    campaignTypes: string[]
  }>({
    dateRange: [],
    channels: [],
    campaignTypes: [],
  })

  const dateRanges = ["Last 7 days", "Last 30 days", "Last 90 days", "This year", "Custom"]
  const channels = ["Google Ads", "Facebook", "Instagram", "LinkedIn", "TikTok", "YouTube", "Twitter"]
  const campaignTypes = ["Search", "Display", "Video", "Shopping", "App", "Discovery", "Performance Max"]

  const handleFilterToggle = (category: keyof typeof activeFilters, value: string) => {
    const newFilters = { ...activeFilters }
    const currentValues = newFilters[category]

    if (currentValues.includes(value)) {
      newFilters[category] = currentValues.filter((v) => v !== value)
    } else {
      newFilters[category] = [...currentValues, value]
    }

    setActiveFilters(newFilters)
    onFiltersChange(newFilters)
    onShowToast("info", "Filters Updated", `Applied ${getTotalFilterCount(newFilters)} filters`)
  }

  const clearAllFilters = () => {
    const emptyFilters = { dateRange: [], channels: [], campaignTypes: [] }
    setActiveFilters(emptyFilters)
    onFiltersChange(emptyFilters)
    onShowToast("success", "Filters Cleared", "All filters have been removed")
  }

  const getTotalFilterCount = (filters = activeFilters) => {
    return filters.dateRange.length + filters.channels.length + filters.campaignTypes.length
  }

  const totalFilters = getTotalFilterCount()

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-12 px-4 rounded-xl bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-purple-400/30 transition-all duration-300 hover-lift button-glow relative"
          >
            <Filter className="mr-2 h-4 w-4 animate-pulse" />
            Smart Filters
            {totalFilters > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 bg-purple-500 text-white text-xs animate-bounce">{totalFilters}</Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 glass-effect border-white/10 text-white">
          <DropdownMenuLabel className="text-purple-300 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </DropdownMenuLabel>
          {dateRanges.map((range) => (
            <DropdownMenuCheckboxItem
              key={range}
              checked={activeFilters.dateRange.includes(range)}
              onCheckedChange={() => handleFilterToggle("dateRange", range)}
              className="hover:bg-white/5 focus:bg-white/5"
            >
              {range}
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator className="bg-white/10" />

          <DropdownMenuLabel className="text-purple-300 flex items-center gap-2">
            <Tv className="h-4 w-4" />
            Channels
          </DropdownMenuLabel>
          {channels.map((channel) => (
            <DropdownMenuCheckboxItem
              key={channel}
              checked={activeFilters.channels.includes(channel)}
              onCheckedChange={() => handleFilterToggle("channels", channel)}
              className="hover:bg-white/5 focus:bg-white/5"
            >
              {channel}
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator className="bg-white/10" />

          <DropdownMenuLabel className="text-purple-300 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Campaign Types
          </DropdownMenuLabel>
          {campaignTypes.map((type) => (
            <DropdownMenuCheckboxItem
              key={type}
              checked={activeFilters.campaignTypes.includes(type)}
              onCheckedChange={() => handleFilterToggle("campaignTypes", type)}
              className="hover:bg-white/5 focus:bg-white/5"
            >
              {type}
            </DropdownMenuCheckboxItem>
          ))}

          {totalFilters > 0 && (
            <>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={clearAllFilters}
                className="hover:bg-red-500/10 focus:bg-red-500/10 text-red-400 cursor-pointer"
              >
                <X className="mr-2 h-4 w-4" />
                Clear All Filters
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Filter Badges */}
      <div className="flex flex-wrap gap-1 max-w-md">
        {activeFilters.dateRange.map((filter) => (
          <Badge
            key={filter}
            variant="secondary"
            className="bg-blue-500/20 text-blue-200 border-blue-400/30 animate-fade-in hover-scale cursor-pointer"
            onClick={() => handleFilterToggle("dateRange", filter)}
          >
            <Calendar className="h-3 w-3 mr-1" />
            {filter}
            <X className="h-3 w-3 ml-1 hover:text-red-400" />
          </Badge>
        ))}
        {activeFilters.channels.map((filter) => (
          <Badge
            key={filter}
            variant="secondary"
            className="bg-green-500/20 text-green-200 border-green-400/30 animate-fade-in hover-scale cursor-pointer"
            onClick={() => handleFilterToggle("channels", filter)}
          >
            <Tv className="h-3 w-3 mr-1" />
            {filter}
            <X className="h-3 w-3 ml-1 hover:text-red-400" />
          </Badge>
        ))}
        {activeFilters.campaignTypes.map((filter) => (
          <Badge
            key={filter}
            variant="secondary"
            className="bg-purple-500/20 text-purple-200 border-purple-400/30 animate-fade-in hover-scale cursor-pointer"
            onClick={() => handleFilterToggle("campaignTypes", filter)}
          >
            <Target className="h-3 w-3 mr-1" />
            {filter}
            <X className="h-3 w-3 ml-1 hover:text-red-400" />
          </Badge>
        ))}
      </div>
    </div>
  )
}
