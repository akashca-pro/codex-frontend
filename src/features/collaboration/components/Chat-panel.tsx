import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCollaboration } from "@/features/collaboration/components/CollaborationProvider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Smile, MessageCircle, Loader2, ChevronDown, ArrowDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ChatMsgEvents } from "@/const/events.const";
import type { ChatMessage } from "@/const/events.const";
import { getCloudinaryUrl } from "@/utils/cloudinaryImageResolver"
import EmojiPicker from "./EmojiPicker";
import { useSelect } from '@/hooks/useSelect'
import { useCollabSessionActions } from '@/hooks/useDispatch'

interface ChatPanelProps {
  currentUserId: string
}

const ChatPanel: React.FC<ChatPanelProps> = ({ currentUserId }) => {
  const { socket, awareness } = useCollaboration();
  const { collabSession, user } = useSelect()
  const { addChatMessages } = useCollabSessionActions()
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [unreadCount, setUnreadCount] = useState(0)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef(collabSession.chatMessages?.length || 0)
  const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false)


  // Scroll to bottom helper
  const scrollToBottom = useCallback((smooth = false) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      })
    }
  }, [])

  // Check if scrolled to bottom
  const checkIfScrolledToBottom = useCallback(() => {
    if (!scrollContainerRef.current) return false
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const threshold = 50
    return scrollHeight - scrollTop - clientHeight < threshold
  }, [])

  const handleScroll = useCallback(() => {
    const isAtBottom = checkIfScrolledToBottom()
    setIsScrolledToBottom(isAtBottom)

    if (isAtBottom) {
      setUnreadCount(0)
      setShowNewMessageIndicator(false)
    }
  }, [checkIfScrolledToBottom])


  // Listen for awareness updates to track typing users
  useEffect(() => {
    if (!awareness) {
      console.warn('Awareness not initialized')
      return
    }

    const updateTypingUsers = () => {
      const states = Array.from(awareness.getStates().entries())
      const typing = new Set<string>()

      states.forEach(([_, state]) => {
        if (state.user && state.user.isTyping && state.user.id) {
          typing.add(state.user.firstName)
        }
      })

      setTypingUsers(typing)
    }

    awareness.on("update", updateTypingUsers)
    return () => awareness.off("update", updateTypingUsers)
  }, [awareness])

  // Listen for incoming chat messages
useEffect(() => {
  if (!socket) {
    return;
  }

  const handleNewMessage = (message: ChatMessage) => {
    addChatMessages(message);

    // Add unread if not from current user and not scrolled to bottom
    if (message.userId !== currentUserId && !isScrolledToBottom) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  socket.on(ChatMsgEvents.SERVER_NEW_MESSAGE, handleNewMessage);

  return () => {
    socket.off(ChatMsgEvents.SERVER_NEW_MESSAGE, handleNewMessage);
  };
}, [socket, currentUserId, isScrolledToBottom]);

  // Auto-scroll when new messages arrive if already at bottom
  useEffect(() => {
    const currentMessageCount = collabSession.chatMessages?.length || 0
    const hasNewMessages = currentMessageCount > previousMessageCountRef.current

    if (hasNewMessages) {
      if (isScrolledToBottom) {
        // Small delay to ensure DOM is updated
        setTimeout(() => scrollToBottom(false), 10)
      }
      previousMessageCountRef.current = currentMessageCount
    }
  }, [collabSession.chatMessages, isScrolledToBottom, scrollToBottom]);

    // Initial scroll to bottom
  useEffect(() => {
    scrollToBottom(false)
  }, [scrollToBottom])

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
    if (!inputValue.trim() || !socket) {
      return
    }

    socket.emit(ChatMsgEvents.CLIENT_SEND_MESSAGE, {
      content: inputValue,
    })

    setInputValue("")
    setIsTyping(false)

    const userState = awareness?.getLocalState() as any
    awareness?.setLocalStateField("user", {
      ...userState?.user,
      isTyping: false,
    })

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Ensure scroll to bottom after sending
    setTimeout(() => scrollToBottom(true), 10)
  }, [inputValue, socket, awareness, scrollToBottom])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const jumpToLatest = () => {
    setIsScrolledToBottom(true)
    setUnreadCount(0)
    setShowNewMessageIndicator(false)
    scrollToBottom(true)
  }

  const handleEmojiSelect = (emoji: string) => {
    setInputValue((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <Card className="h-full flex flex-col border-r rounded-none bg-card/50">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-sm">Team Chat</h2>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-xs">
            unread {unreadCount}
          </Badge>
        )}
      </motion.div>

      {/* Messages Area with custom scroll */}
      <div className="flex-1 relative min-h-0">
        <div
          ref={scrollContainerRef}
          className="absolute inset-0 overflow-y-auto scroll-smooth"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'thin' }}
        >
          <div className="space-y-3 p-3 pb-2">
            <AnimatePresence>
              {collabSession.chatMessages?.map((message: any, index: number) => {
                const isCurrentUser = message.userId === currentUserId
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: Math.min(index * 0.05, 0.5) }}
                    className={`flex gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className="h-6 w-6 flex-shrink-0">
                      <AvatarImage src={getCloudinaryUrl(message.avatar) || "/placeholder.svg"} alt={message.username} />
                      <AvatarFallback className="text-xs">{message.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className={`flex flex-col gap-1 max-w-[75%] ${isCurrentUser ? "items-end" : ""}`}>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium">{message.firstName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <p
                        className={`text-sm rounded-lg px-3 py-2 break-words ${
                          isCurrentUser ? "bg-primary text-primary-foreground" : "bg-background/70 border border-border"
                        }`}
                      >
                        {message.content}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {/* Typing Indicator */}
            { typingUsers && 
            !Array.from(typingUsers).find(u=>u === user.details?.firstName) &&
             <AnimatePresence>
              {typingUsers.size > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-2 text-xs text-orange-600 items-center"
                >
                  <Loader2 className="h-3 w-3 animate-spin" />
                   <span>{Array.from(typingUsers).join(", ")} is typing...</span>
                </motion.div>
              )}
            </AnimatePresence>}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* New Message Indicator - floating button */}
        <AnimatePresence>
          {showNewMessageIndicator && !isScrolledToBottom && (
            <motion.div
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <Button
                variant="default"
                size="sm"
                className="h-8 gap-2 shadow-lg"
                onClick={jumpToLatest}
              >
                <ArrowDown className="h-3 w-3" />
                New messages
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs ml-1 h-5 px-1.5">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Jump to Latest Button - alternative position */}
        <AnimatePresence>
          {!showNewMessageIndicator && !isScrolledToBottom && (
            <motion.div
              className="absolute bottom-2 right-2 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-full shadow-lg bg-background"
                onClick={jumpToLatest}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <motion.div
        className="px-3 py-3 border-t border-border bg-background/30 space-y-2 flex-shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex gap-1 relative">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowEmojiPicker((v) => !v)}>
            <Smile className="h-4 w-4" />
          </Button>
          {showEmojiPicker && (
            <EmojiPicker onSelect={handleEmojiSelect} />
          )}
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
