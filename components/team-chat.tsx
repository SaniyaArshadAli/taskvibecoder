"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, Send, Users, X, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  user: string
  message: string
  timestamp: Date
  avatar: string
  type: "message" | "system"
}

interface TeamChatProps {
  onShowToast: (type: "success" | "error" | "info", title: string, message: string) => void
}

export function TeamChat({ onShowToast }: TeamChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: "Sarah Chen",
      message: "Campaign performance is looking great this week! 📈",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      avatar: "SC",
      type: "message",
    },
    {
      id: "2",
      user: "Mike Johnson",
      message: "Should we increase the budget for the summer sale campaign?",
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      avatar: "MJ",
      type: "message",
    },
    {
      id: "3",
      user: "System",
      message: "New campaign 'Holiday Special' has been created",
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      avatar: "SY",
      type: "system",
    },
  ])
  const [onlineUsers] = useState(["Sarah Chen", "Mike Johnson", "Alex Rivera", "Emma Davis"])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        user: "You",
        message: message.trim(),
        timestamp: new Date(),
        avatar: "YO",
        type: "message",
      }
      setMessages((prev) => [...prev, newMessage])
      setMessage("")
      onShowToast("success", "Message Sent", "Your message has been sent to the team")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 to-blue-500/40 rounded-full blur-xl animate-pulse-slow scale-110"></div>
        <Button
          onClick={() => setIsOpen(true)}
          className="relative h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-2xl hover-lift button-glow animate-bounce-slow pulse-glow-purple border-2 border-white/20"
        >
          <MessageCircle className="h-7 w-7 text-white animate-pulse" />
          <Badge className="absolute -top-3 -right-3 h-7 w-7 p-0 bg-red-500 text-white text-sm animate-pulse border-2 border-white shadow-lg">
            {messages.filter((m) => m.user !== "You").length}
          </Badge>
        </Button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? "w-80" : "w-96"}`}>
      <Card
        className={`glass-effect border-white/10 rounded-2xl hover-lift transition-all duration-300 ${isMinimized ? "h-16" : "h-96"} overflow-hidden`}
      >
        <CardHeader className="pb-2 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-purple-400 animate-pulse" />
              <CardTitle className="text-white text-sm">Team Chat</CardTitle>
              <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30 text-xs">
                {onlineUsers.length} online
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 text-purple-300 hover:text-white hover:bg-white/10"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 text-purple-300 hover:text-white hover:bg-white/10"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            {/* Online Users */}
            <div className="p-3 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2 text-xs text-purple-300">
                <Users className="h-3 w-3" />
                <span>Online:</span>
                <div className="flex gap-1">
                  {onlineUsers.slice(0, 3).map((user, index) => (
                    <Avatar key={user} className={`h-5 w-5 animate-fade-in stagger-${index + 1}`}>
                      <AvatarFallback className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        {user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {onlineUsers.length > 3 && (
                    <Badge variant="secondary" className="h-5 w-5 p-0 text-xs bg-white/10 text-purple-300">
                      +{onlineUsers.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg, index) => (
                <div key={msg.id} className={`flex gap-2 animate-slide-in-up stagger-${(index % 3) + 1}`}>
                  <Avatar className="h-6 w-6 flex-shrink-0">
                    <AvatarFallback
                      className={`text-xs ${
                        msg.type === "system"
                          ? "bg-gradient-to-r from-gray-500 to-gray-600"
                          : msg.user === "You"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : "bg-gradient-to-r from-purple-500 to-blue-500"
                      } text-white`}
                    >
                      {msg.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${msg.type === "system" ? "text-gray-400" : "text-white"}`}>
                        {msg.user}
                      </span>
                      <span className="text-xs text-purple-400">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p
                      className={`text-sm ${
                        msg.type === "system" ? "text-gray-400 italic" : "text-purple-200"
                      } break-words`}
                    >
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-3 border-t border-white/10 bg-white/5">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400/20 text-sm h-8"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  size="sm"
                  className="h-8 w-8 p-0 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 hover-bounce"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
