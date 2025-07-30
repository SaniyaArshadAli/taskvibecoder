"use client"

import { useState, useEffect } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ThemeToggleProps {
  onShowToast: (type: "success" | "error" | "info", title: string, message: string) => void
}

export function ThemeToggle({ onShowToast }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark")

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark" | "system") || "dark"
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    const root = document.documentElement

    if (newTheme === "light") {
      root.style.setProperty("--background", "0 0% 100%")
      root.style.setProperty("--foreground", "222.2 84% 4.9%")
      root.style.setProperty("--card", "0 0% 100%")
      root.style.setProperty("--card-foreground", "222.2 84% 4.9%")
      root.style.setProperty("--muted", "210 40% 96%")
      root.style.setProperty("--muted-foreground", "215.4 16.3% 46.9%")
      root.classList.remove("dark")
      root.classList.add("light")
    } else if (newTheme === "dark") {
      root.style.setProperty("--background", "220 15% 6%")
      root.style.setProperty("--foreground", "220 9% 98%")
      root.style.setProperty("--card", "220 13% 9%")
      root.style.setProperty("--card-foreground", "220 9% 98%")
      root.style.setProperty("--muted", "220 13% 15%")
      root.style.setProperty("--muted-foreground", "220 9% 65%")
      root.classList.remove("light")
      root.classList.add("dark")
    } else {
      // System theme
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      applyTheme(prefersDark ? "dark" : "light")
    }
  }

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
    onShowToast("success", "Theme Changed", `Switched to ${newTheme} mode`)
  }

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-5 w-5 animate-spin-slow text-yellow-400" />
      case "dark":
        return <Moon className="h-5 w-5 animate-pulse text-blue-400" />
      default:
        return <Monitor className="h-5 w-5 animate-bounce text-purple-400" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-purple-400/30 transition-all duration-300 hover-lift button-glow"
        >
          {getIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-effect border-white/10 text-white">
        <DropdownMenuItem
          onClick={() => handleThemeChange("light")}
          className="hover:bg-white/5 focus:bg-white/5 cursor-pointer"
        >
          <Sun className="mr-2 h-4 w-4 text-yellow-400" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("dark")}
          className="hover:bg-white/5 focus:bg-white/5 cursor-pointer"
        >
          <Moon className="mr-2 h-4 w-4 text-blue-400" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("system")}
          className="hover:bg-white/5 focus:bg-white/5 cursor-pointer"
        >
          <Monitor className="mr-2 h-4 w-4 text-purple-400" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
