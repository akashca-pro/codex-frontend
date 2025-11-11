import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Code2, Trophy, Target, Flame } from "lucide-react"
import CalendarHeatmap from "./components/CalendarHeatmap"
import { useUserDashboardQuery } from '@/apis/dashboard/user'
import { useMemo } from "react"

const staticStats = [
  {
    title: "Global Rank",
    value: "#1,247",
    icon: Trophy,
    color: "text-yellow-500",
  },
  {
    title: "Acceptance Rate",
    value: "87.3%",
    icon: Target,
    color: "text-blue-500",
  },
]

export default function UserDashboard() {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data: apiResponse, isLoading, isError } = useUserDashboardQuery({
    userTimezone
  });
  const dashboardData = apiResponse?.data
  const stats = useMemo(() => {
      if (!dashboardData) {
        return [] // Return empty or skeleton data
      }
      return [
        {
          title: "Problems Solved",
          value: dashboardData.problemsSolved.toString(),
          icon: Code2,
          color: "text-green-500",
        },
        {
          title: "Current Streak",
          value: `${dashboardData.currentStreak} ${dashboardData.currentStreak === 1 ? 'day' : 'days'}`,
          icon: Flame,
          color: "text-orange-500",
        },
        ...staticStats, // Add the static ones
      ]
    }, [dashboardData])

    if (isLoading) {
      return <div className="p-6">Loading dashboard...</div>
    }

    if (isError || !dashboardData) {
      return <div className="p-6 text-red-500">Error loading dashboard.</div>
    }

return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your coding progress.</p>
      </motion.div>

      {/* Stats Grid (now uses dynamic 'stats' array) */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </motion.div>

      {/* Main Content */}
        {/* Activity Heatmap (pass 'dashboardData.heatmap' as a prop) */}
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
              {/* Pass the live data to the component */}
              <CalendarHeatmap data={dashboardData.heatmap} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity (uses 'dashboardData.recentActivities') */}
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

          <CardContent className="space-y-2">
            {/* Header Row */}
            <div className="grid grid-cols-4 text-xs font-medium text-muted-foreground border-b border-border pb-2">
              <div>Title</div>
              <div>Difficulty</div>
              <div>Status</div>
              <div className="text-right">Time</div>
            </div>

            {/* Activity Rows */}
            {dashboardData.recentActivities.map((activity, index) => (
              <div
                key={index}
                className="grid grid-cols-4 items-center py-2 text-sm border-b border-border last:border-none"
              >
                {/* Title */}
                <div className="font-medium truncate">{activity.title}</div>

                {/* Difficulty */}
                <div>
                  <Badge
                    variant={
                      activity.difficulty.toLowerCase() === "easy"
                        ? "secondary"
                        : activity.difficulty.toLowerCase() === "medium"
                        ? "default"
                        : "destructive"
                    }
                    className="text-xs capitalize"
                  >
                    {activity.difficulty}
                  </Badge>
                </div>

                {/* Status */}
                <div>
                  <Badge
                    variant={activity.status.toLowerCase() === "accepted" ? "default" : "outline"}
                    className="text-xs capitalize"
                  >
                    {activity.status}
                  </Badge>
                </div>

                {/* Time */}
                <div className="text-right text-xs text-muted-foreground">
                  {activity.timeAgo}
                </div>
              </div>
            ))}

            {/* Empty State */}
            {dashboardData.recentActivities.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent activity.
              </p>
            )}
          </CardContent>
        </Card>
        </motion.div>
        
      {/* Progress Section
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
      </motion.div> */}
    </div>
  )
}
