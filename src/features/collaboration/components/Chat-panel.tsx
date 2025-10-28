import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCollaboration } from "@/features/collaboration/components/CollaborationProvider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, ChevronDown, Smile, Code, MessageCircle, Loader2 } from "lucide-react"
import type { Message } from "../schemas/collaboration"
import { formatDistanceToNow } from "date-fns"

interface ChatPanelProps {
  currentUserId: string
  onChatMessage?: (message: Message) => void
}

const ChatPanel: React.FC<ChatPanelProps> = ({ currentUserId, onChatMessage }) => {
  const { socket, awareness } = useCollaboration()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [unreadCount, setUnreadCount] = useState(0)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Listen for awareness updates to track typing users
  useEffect(() => {
    if (!awareness) return

    const updateTypingUsers = () => {
      const states = Array.from(awareness.getStates().entries())
      const typing = new Set<string>()

      states.forEach(([clientId, state]) => {
        if (state.user?.isTyping) {
          typing.add(state.user.id)
        }
      })

      setTypingUsers(typing)
    }

    awareness.on("update", updateTypingUsers)
    return () => awareness.off("update", updateTypingUsers)
  }, [awareness])

  // Listen for incoming chat messages
useEffect(() => {
  if (!socket) return; // early return if no socket

  const handleChatMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);

    // Add unread if not from current user and not scrolled to bottom
    if (message.userId !== currentUserId && !isScrolledToBottom) {
      setUnreadCount((prev) => prev + 1);
    }

    onChatMessage?.(message);
  };

  // ✅ Register event listener
  socket.on("chat-message", handleChatMessage);

  // ✅ Proper cleanup: remove listener and disconnect only if needed
  return () => {
    socket.off("chat-message", handleChatMessage);
  };
}, [socket, currentUserId, isScrolledToBottom, onChatMessage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isScrolledToBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isScrolledToBottom])

  // Handle scroll detection
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const isAtBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 50

    setIsScrolledToBottom(isAtBottom)

    if (isAtBottom) {
      setUnreadCount(0)
    }
  }

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)

    if (!isTyping && socket) {
      setIsTyping(true)
      const userState = awareness?.getLocalState() as any
      awareness?.setLocalStateField("user", {
        ...userState?.user,
        isTyping: true,
      })
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to mark typing as finished
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      const userState = awareness?.getLocalState() as any
      awareness?.setLocalStateField("user", {
        ...userState?.user,
        isTyping: false,
      })
    }, 1000)
  }

  // Handle message send
  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || !socket) return

    const userState = awareness?.getLocalState() as any
    const message: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      userId: currentUserId,
      username: userState?.user?.name || "Anonymous",
      avatar: userState?.user?.avatar,
      content: inputValue,
      timestamp: Date.now(),
      type: "text",
    }

    socket.emit("chat-message", message)
    setMessages((prev) => [...prev, message])
    setInputValue("")
    setIsTyping(false)

    // Update typing state
    awareness?.setLocalStateField("user", {
      ...userState?.user,
      isTyping: false,
    })

    // Clear timeout if exists
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }, [inputValue, socket, awareness, currentUserId])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const jumpToLatest = () => {
    setIsScrolledToBottom(true)
    setUnreadCount(0)
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  return (
    <Card className="h-full flex flex-col border-r rounded-none bg-card/50">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between px-4 py-3 border-b border-border"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-sm">Team Chat</h2>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-xs">
            {unreadCount}
          </Badge>
        )}
      </motion.div>

      {/* Messages Area */}
      <ScrollArea ref={scrollRef} className="flex-1" onScroll={handleScroll}>
        <div className="space-y-3 p-3">
          <AnimatePresence>
            {messages.map((message, index) => {
              const isCurrentUser = message.userId === currentUserId
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-6 w-6 flex-shrink-0">
                    <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.username} />
                    <AvatarFallback className="text-xs">{message.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className={`flex flex-col gap-1 ${isCurrentUser ? "items-end" : ""}`}>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium">{message.username}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </span>
                    </div>

                    {message.type === "code" ? (
                      <pre
                        className={`text-xs p-2 rounded bg-background/50 border border-border max-w-xs overflow-x-auto ${
                          isCurrentUser ? "border-blue-500/30 bg-blue-500/5" : "border-border"
                        }`}
                      >
                        <code>{message.content}</code>
                      </pre>
                    ) : (
                      <p
                        className={`text-sm rounded-lg px-3 py-2 max-w-xs break-words ${
                          isCurrentUser ? "bg-primary text-primary-foreground" : "bg-background/70 border border-border"
                        }`}
                      >
                        {message.content}
                      </p>
                    )}

                    {message.threadCount ? (
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {message.threadCount} replies
                      </Button>
                    ) : null}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {typingUsers.size > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-2 text-xs text-muted-foreground"
              >
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>{Array.from(typingUsers).join(", ")} is typing...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Jump to Latest Button */}
      <AnimatePresence>
        {!isScrolledToBottom && (
          <motion.div
            className="px-3 py-2 border-t border-border"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full h-7 text-xs gap-1 bg-transparent"
              onClick={jumpToLatest}
            >
              <ChevronDown className="h-3 w-3" />
              Jump to latest
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <motion.div
        className="px-3 py-3 border-t border-border bg-background/30 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Smile className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Code className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="h-8 text-sm"
          />
          <Button size="sm" onClick={handleSendMessage} disabled={!inputValue.trim()} className="h-8 w-8 p-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </Card>
  )
}

export default ChatPanel
