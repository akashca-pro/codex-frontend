import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { getCountryFlag } from "@/utils/countryFlag"
import { Award } from "lucide-react"
import type { LeaderboardResponse } from "@/types/leaderboard/responses/user"
import { getCountryCode } from "@/utils/countryMap"

interface LeaderboardListProps {
  data: LeaderboardResponse[]
  searchTerm?: string
}

export function LeaderboardList({ data, searchTerm = "" }: LeaderboardListProps) {

  if (!data || data.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No leaderboard data found.</div>
  }

  const filtered = data.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Award className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Award className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">
            {rank + 1}
          </span>
        )
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-yellow-500"
    if (rank === 2) return "bg-gray-400"
    if (rank === 3) return "bg-amber-600"
    return "bg-muted"
  }

  return (
    <div className="space-y-2">
      {filtered.map((user, index) => (
        <motion.div
          key={user.id}
          className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          {/* Rank */}
          <div className="flex items-center justify-center w-8">
            {getRankIcon(user.rank)}
          </div>

          {/* User Info */}
        <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{user.username}</h3>
            {user.entity && (
            <div className="flex items-center gap-1">
                <span>{getCountryFlag(user.entity)}</span>
                <span className="text-sm text-muted-foreground">
                {getCountryCode(user.entity)}
                </span>
            </div>
            )}
        </div>
        {user.problemsSolved !== undefined && (
            <p className="text-sm text-muted-foreground">
            {user.problemsSolved} problems solved
            </p>
        )}
        </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-bold">{user.score}</div>
              <div className="text-muted-foreground">Score</div>
            </div>
          </div>

          {/* Rank Badge */}
          <Badge className={`${getRankBadge(user.rank)} text-white`}>
            #{user.rank}
          </Badge>
        </motion.div>
      ))}
    </div>
  )
}