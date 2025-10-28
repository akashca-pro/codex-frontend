export interface Message {
  id: string
  userId: string
  username: string
  avatar?: string
  content: string
  timestamp: number
  type?: "text" | "code" | "system"
  threadCount?: number
  reactions?: Record<string, string[]>
  thread?: Message[]
}

export interface CollabMetadata {
  language: string
  ownerId: string
  timerStart: number
  duration: number
  title?: string
  subtitle?: string
  sessionId?: string
}

export interface UserPresence {
  id: string
  name: string
  color: string
  status: "active" | "idle" | "away"
  cursor?: { line: number; column: number }
  lastSeen?: number
}

export interface SessionState {
  participants: UserPresence[]
  isOwner: boolean
  metadata: CollabMetadata
  messages: Message[]
}
