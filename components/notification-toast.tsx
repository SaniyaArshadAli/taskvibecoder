"use client"

import { useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

interface Toast {
  id: string
  type: "success" | "error" | "info"
  title: string
  message: string
}

interface NotificationToastProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function NotificationToast({ toasts, onRemove }: NotificationToastProps) {
  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        onRemove(toast.id)
      }, 5000)
      return () => clearTimeout(timer)
    })
  }, [toasts, onRemove])

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-400" />
      default:
        return <Info className="h-5 w-5 text-blue-400" />
    }
  }

  const getGradient = (type: string) => {
    switch (type) {
      case "success":
        return "from-green-500/20 to-emerald-500/20"
      case "error":
        return "from-red-500/20 to-pink-500/20"
      default:
        return "from-blue-500/20 to-cyan-500/20"
    }
  }

  const handleToastClose = (toastId: string) => {
    console.log(`Toast closed: ${toastId}`) // Debug log
    onRemove(toastId)
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div key={toast.id} className={`relative group animate-in slide-in-from-right duration-300`}>
          <div
            className={`absolute inset-0 bg-gradient-to-r ${getGradient(toast.type)} rounded-xl blur-xl opacity-50`}
          ></div>
          <div className="relative glass-effect border-white/10 rounded-xl p-4 min-w-80 hover-lift">
            <div className="flex items-start gap-3">
              {getIcon(toast.type)}
              <div className="flex-1">
                <h4 className="font-semibold text-white">{toast.title}</h4>
                <p className="text-sm text-purple-300 mt-1">{toast.message}</p>
              </div>
              <button
                onClick={() => handleToastClose(toast.id)}
                className="h-6 w-6 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors border-none bg-transparent cursor-pointer"
                aria-label="Close notification"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
