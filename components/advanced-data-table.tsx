"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  Download,
} from "lucide-react"

interface DataTableProps {
  data: any[]
  columns: {
    key: string
    label: string
    sortable?: boolean
    filterable?: boolean
    render?: (value: any, row: any) => React.ReactNode
  }[]
  title: string
  description: string
  onShowToast: (type: "success" | "error" | "info", title: string, message: string) => void
}

export function AdvancedDataTable({ data, columns, title, description, onShowToast }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})

  // Filter data based on search term and column filters
  const filteredData = useMemo(() => {
    let filtered = data

    // Global search
    if (searchTerm) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Column-specific filters
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((row) => String(row[key]).toLowerCase().includes(value.toLowerCase()))
      }
    })

    return filtered
  }, [data, searchTerm, columnFilters])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }, [filteredData, sortConfig])

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === "asc") {
          return { key, direction: "desc" }
        } else {
          return null // Remove sorting
        }
      }
      return { key, direction: "asc" }
    })
    onShowToast("info", "Table Sorted", `Sorted by ${key}`)
  }

  const handleColumnFilter = (key: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleExport = () => {
    const csvContent = [
      columns.map((col) => col.label).join(","),
      ...sortedData.map((row) => columns.map((col) => `"${row[col.key]}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-data.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    onShowToast("success", "Export Complete", "Data exported to CSV successfully")
  }

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) {
      return <ArrowUpDown className="h-4 w-4 text-purple-400" />
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-4 w-4 text-purple-400" />
    ) : (
      <ArrowDown className="h-4 w-4 text-purple-400" />
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="glass-effect border-white/10 rounded-3xl hover-lift hover-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Filter className="h-5 w-5 animate-pulse text-purple-400" />
                {title}
              </CardTitle>
              <CardDescription className="text-purple-300">{description}</CardDescription>
            </div>
            <Button
              onClick={handleExport}
              size="sm"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover-bounce"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-300" />
              <Input
                placeholder="Search all columns..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400/20"
              />
            </div>
            <div className="flex gap-2">
              {columns
                .filter((col) => col.filterable)
                .map((col) => (
                  <DropdownMenu key={col.key}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        {col.label}
                        {columnFilters[col.key] && (
                          <Badge className="ml-2 h-4 w-4 p-0 bg-purple-500 text-white text-xs">1</Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass-effect border-white/10">
                      <div className="p-2">
                        <Input
                          placeholder={`Filter ${col.label}...`}
                          value={columnFilters[col.key] || ""}
                          onChange={(e) => handleColumnFilter(col.key, e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-purple-300"
                        />
                      </div>
                      {columnFilters[col.key] && (
                        <DropdownMenuItem
                          onClick={() => handleColumnFilter(col.key, "")}
                          className="text-red-400 hover:bg-red-500/10"
                        >
                          Clear Filter
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 bg-white/5">
                  {columns.map((column) => (
                    <TableHead key={column.key} className="text-purple-300 font-semibold">
                      {column.sortable ? (
                        <Button
                          variant="ghost"
                          onClick={() => handleSort(column.key)}
                          className="h-auto p-0 font-semibold text-purple-300 hover:text-white hover:bg-transparent"
                        >
                          {column.label}
                          <div className="ml-2">{getSortIcon(column.key)}</div>
                        </Button>
                      ) : (
                        column.label
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => (
                    <TableRow
                      key={index}
                      className={`border-white/10 hover:bg-white/5 transition-all duration-300 animate-slide-in-up stagger-${(index % 5) + 1}`}
                    >
                      {columns.map((column) => (
                        <TableCell key={column.key} className="text-white">
                          {column.render ? column.render(row[column.key], row) : row[column.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-8 text-purple-300">
                      No data found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-purple-300">Rows per page:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                  >
                    {pageSize}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-effect border-white/10">
                  {[5, 10, 20, 50].map((size) => (
                    <DropdownMenuItem
                      key={size}
                      onClick={() => {
                        setPageSize(size)
                        setCurrentPage(1)
                      }}
                      className="hover:bg-white/5 text-white"
                    >
                      {size}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-purple-300">
                Showing {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)} to{" "}
                {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-white px-3 py-1 bg-purple-500/20 rounded border border-purple-400/30">
                {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
