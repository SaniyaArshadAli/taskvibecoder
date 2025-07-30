"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, RefreshCw } from "lucide-react"

interface SearchResultsProps {
  query: string
  results: any[]
  isLoading: boolean
  isVisible: boolean
  onResultSelect: (result: any) => void
  onClose: () => void
}

export function SearchResults({ query, results, isLoading, isVisible, onResultSelect, onClose }: SearchResultsProps) {
  if (!isVisible || !query) return null

  const handleResultClick = (result: any) => {
    console.log(`Search result clicked: ${result.title}`) // Debug log
    onResultSelect(result)
    onClose()
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-50">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-xl opacity-50"></div>
        <Card className="relative glass-effect border-white/10 rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-purple-300 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Results for "{query}"{isLoading && <RefreshCw className="h-3 w-3 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              <div className="text-center py-4 text-purple-300">Searching...</div>
            ) : results.length > 0 ? (
              results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group/result text-left border-none bg-transparent"
                  type="button"
                >
                  <div className={`p-2 rounded-lg ${result.gradient}`}>
                    <div className="h-4 w-4 text-white flex items-center justify-center">
                      {result.type === "Campaign"
                        ? "🎯"
                        : result.type === "Metric"
                          ? "📊"
                          : result.type === "Audience"
                            ? "👥"
                            : "📋"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{result.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {result.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-purple-300">{result.description}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-4 text-purple-300">No results found for "{query}"</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
