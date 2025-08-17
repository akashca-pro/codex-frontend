import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Code2, Trophy, Target, Flame } from "lucide-react"
import CalendarHeatmap from "./components/CalendarHeatmap"

const stats = [
  {
    title: "Problems Solved",
    value: "247",
    change: "+12 this week",
    icon: Code2,
    color: "text-green-500",
  },
  {
    title: "Current Streak",
    value: "15 days",
    change: "Personal best: 23",
    icon: Flame,
    color: "text-orange-500",
  },
  {
    title: "Global Rank",
    value: "#1,247",
    change: "↑ 23 positions",
    icon: Trophy,
    color: "text-yellow-500",
  },
  {
    title: "Acceptance Rate",
    value: "87.3%",
    change: "+2.1% this month",
    icon: Target,
    color: "text-blue-500",
  },
]

const recentActivity = [
  { problem: "Two Sum", difficulty: "Easy", status: "Solved", time: "2 hours ago" },
  { problem: "Longest Substring", difficulty: "Medium", status: "Attempted", time: "5 hours ago" },
  { problem: "Merge K Lists", difficulty: "Hard", status: "Solved", time: "1 day ago" },
  { problem: "Valid Parentheses", difficulty: "Easy", status: "Solved", time: "2 days ago" },
]

export default function UserDashboard() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your coding progress.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Heatmap */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Activity
              </CardTitle>
              <CardDescription>Your coding activity over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarHeatmap />
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest problem attempts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.problem}</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          activity.difficulty === "Easy"
                            ? "secondary"
                            : activity.difficulty === "Medium"
                              ? "default"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {activity.difficulty}
                      </Badge>
                      <Badge variant={activity.status === "Solved" ? "default" : "outline"} className="text-xs">
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Progress by Category</CardTitle>
            <CardDescription>Your problem-solving progress across different topics</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="difficulty" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="difficulty">By Difficulty</TabsTrigger>
                <TabsTrigger value="topics">By Topics</TabsTrigger>
              </TabsList>
              <TabsContent value="difficulty" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Easy</span>
                      <span className="text-sm text-muted-foreground">156/234</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Medium</span>
                      <span className="text-sm text-muted-foreground">78/456</span>
                    </div>
                    <Progress value={17} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Hard</span>
                      <span className="text-sm text-muted-foreground">13/189</span>
                    </div>
                    <Progress value={7} className="h-2" />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="topics" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Arrays</span>
                      <span className="text-sm text-muted-foreground">45/67</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Dynamic Programming</span>
                      <span className="text-sm text-muted-foreground">23/89</span>
                    </div>
                    <Progress value={26} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Trees</span>
                      <span className="text-sm text-muted-foreground">34/56</span>
                    </div>
                    <Progress value={61} className="h-2" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
