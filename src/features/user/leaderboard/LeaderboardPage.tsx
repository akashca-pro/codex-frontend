import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Trophy, Medal, Award } from "lucide-react"

const leaderboardData = [
  {
    rank: 1,
    username: "CodeMaster2024",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 2847,
    solved: 456,
    country: "US",
    streak: 89,
  },
  {
    rank: 2,
    username: "AlgoNinja",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 2756,
    solved: 423,
    country: "CN",
    streak: 67,
  },
  {
    rank: 3,
    username: "ByteWarrior",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 2689,
    solved: 398,
    country: "IN",
    streak: 45,
  },
  {
    rank: 4,
    username: "DataStructureGuru",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 2634,
    solved: 387,
    country: "DE",
    streak: 34,
  },
  {
    rank: 5,
    username: "RecursionKing",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 2598,
    solved: 376,
    country: "JP",
    streak: 56,
  },
  {
    rank: 6,
    username: "DynamicProgrammer",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 2567,
    solved: 365,
    country: "KR",
    streak: 23,
  },
  {
    rank: 7,
    username: "GraphExplorer",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 2534,
    solved: 354,
    country: "CA",
    streak: 78,
  },
  {
    rank: 8,
    username: "TreeTraverser",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 2501,
    solved: 343,
    country: "AU",
    streak: 12,
  },
]

export default function Leaderboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("global")

  const filteredData = leaderboardData.filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()))

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return rank === 1 ? "bg-yellow-500" : rank === 2 ? "bg-gray-400" : "bg-amber-600"
    }
    return "bg-muted"
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank against other coders worldwide.</p>
      </motion.div>

      {/* Search */}
      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="global">Global</TabsTrigger>
                <TabsTrigger value="country">Country</TabsTrigger>
                <TabsTrigger value="friends">Friends</TabsTrigger>
              </TabsList>
              <TabsContent value="global" className="space-y-4 mt-6">
                <div className="space-y-2">
                  {filteredData.map((user, index) => (
                    <motion.div
                      key={user.username}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      {/* Rank */}
                      <div className="flex items-center justify-center w-8">{getRankIcon(user.rank)}</div>

                      {/* Avatar */}
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate">{user.username}</h3>
                          <Badge variant="outline" className="text-xs">
                            {user.country}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.solved} problems solved</p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="font-bold">{user.score}</div>
                          <div className="text-muted-foreground">Score</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold">{user.streak}</div>
                          <div className="text-muted-foreground">Streak</div>
                        </div>
                      </div>

                      {/* Rank Badge */}
                      <Badge className={`${getRankBadge(user.rank)} text-white`}>#{user.rank}</Badge>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="country" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">Country rankings will be displayed here.</div>
              </TabsContent>
              <TabsContent value="friends" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">Friends rankings will be displayed here.</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
