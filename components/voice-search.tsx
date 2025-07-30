"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface VoiceSearchProps {
  onVoiceCommand: (command: string) => void
  onShowToast: (type: "success" | "error" | "info", title: string, message: string) => void
}

export function VoiceSearch({ onVoiceCommand, onShowToast }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setIsSupported(true)
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex
        const transcript = event.results[current][0].transcript
        setTranscript(transcript)

        if (event.results[current].isFinal) {
          onVoiceCommand(transcript)
          setTranscript("")
          setIsListening(false)
        }
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
        onShowToast("error", "Voice Error", "Could not process voice command")
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [onVoiceCommand, onShowToast])

  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      setIsListening(true)
      recognitionRef.current.start()
      onShowToast("info", "Voice Search", "Listening... Try saying 'show campaigns' or 'export report'")
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={isListening ? stopListening : startListening}
        className={`h-12 w-12 rounded-xl transition-all duration-300 hover-lift button-glow ${
          isListening
            ? "bg-red-500/20 border-red-400/30 text-red-400 animate-pulse pulse-glow-purple"
            : "bg-white/5 border-white/10 text-white hover:bg-purple-500/20 hover:border-purple-400/30"
        }`}
      >
        {isListening ? <MicOff className="h-5 w-5 animate-bounce" /> : <Mic className="h-5 w-5 hover:animate-pulse" />}
      </Button>
      {transcript && (
        <Badge variant="secondary" className="animate-fade-in bg-purple-500/20 text-purple-200 border-purple-400/30">
          <Volume2 className="h-3 w-3 mr-1 animate-pulse" />
          {transcript}
        </Badge>
      )}
    </div>
  )
}
