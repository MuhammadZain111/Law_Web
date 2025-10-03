import React, { useState, useEffect, useRef } from "react"

// ✅ Use relative imports (not Next.js @/)
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

// ✅ Icons from lucide-react
import { Send, User, Bot } from "lucide-react"

// Mock Data (you can later connect this to backend)
const mockChats = [
  { id: 1, sender: "lawyer", message: "Hello! How can I help you today?" },
  { id: 2, sender: "client", message: "I want to discuss my case." },
]

export default function LiveChat() {
  const [messages, setMessages] = useState(mockChats)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)

  // ✅ Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const newMessage = { id: Date.now(), sender: "client", message: input }
    setMessages([...messages, newMessage])
    setInput("")
  }

  return (
    <Card className="w-full h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" /> Live Chat
        </CardTitle>
      </CardHeader>

      {/* Chat Window */}
      <CardContent className="flex-1 overflow-y-auto space-y-3 p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${
              msg.sender === "client" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "lawyer" && <Bot className="h-5 w-5" />}
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] ${
                msg.sender === "client"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {msg.message}
            </div>
            {msg.sender === "client" && <User className="h-5 w-5" />}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input Section */}
      <div className="flex items-center gap-2 border-t p-3">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
