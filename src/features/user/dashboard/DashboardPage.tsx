import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Code2, Flame, Trophy } from "lucide-react"
import CalendarHeatmap from "./components/CalendarHeatmap"
import { useUserDashboardQuery } from '@/apis/dashboard/user'
import { useMemo } from "react"
import UserDashboardLoadingSkeleton from "./components/LoadingSkeleton"
import { getCountryFlag } from "@/utils/countryFlag"

export default function UserDashboard() {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data: apiResponse, isLoading, isError } = useUserDashboardQuery({ userTimezone });
  const dashboardData = apiResponse?.data;

  const stats = useMemo(() => {
    if (!dashboardData) return [];

    return [
      {
        title: "Total Problems Solved",
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
      {
        title: "Ranks",
        value: `#${dashboardData.leaderboardDetails.globalRank} / #${dashboardData.leaderboardDetails.entityRank ?? 'No country set'}`,
        subtext: `Global / ${dashboardData.leaderboardDetails.entity ?? 'No country set'}`,
        icon: Trophy,
        flag: dashboardData.leaderboardDetails.entity ? getCountryFlag(dashboardData.leaderboardDetails.entity) : '',
        color: "text-yellow-500",
      },
      {
        title: "By Difficulty",
        type: "difficulty",
        data: dashboardData.solvedByDifficulty,
      },
    ];
  }, [dashboardData]);

  if (isLoading) return <UserDashboardLoadingSkeleton />;
  if (isError || !dashboardData) return <div className="p-6 text-red-500">Error loading dashboard.</div>;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
        {stats.map((stat, idx) => {
          // --- Difficulty Card ---
          if (stat.type === "difficulty") {
            const difficulties = ["easy", "medium", "hard"];
            const colors = {
              easy: "text-green-500 border-green-400",
              medium: "text-yellow-500 border-yellow-400",
              hard: "text-red-500 border-red-400",
            };

            const counts: Record<string, number> = stat.data.reduce((acc, d) => {
              acc[d.difficulty.toLowerCase()] = d.count;
              return acc;
            }, {} as Record<string, number>);

            return (
              <Card key={idx} className="relative flex flex-col items-center justify-center overflow-hidden">
                <CardHeader className="pb-2 text-center">
                  <CardTitle className="text-sm font-medium">Problems by Difficulty</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-around w-full px-4">
                  {difficulties.map((diff, index) => (
                    <motion.div
                      key={diff}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      className="flex flex-col items-center justify-center space-y-1"
                    >
                      <div
                        className={`relative flex items-center justify-center w-12 h-12 rounded-full border-4 ${colors[diff]} bg-muted`}
                      >
                        <span className={`text-sm font-semibold ${colors[diff].split(" ")[0]}`}>
                          {counts[diff] || 0}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground capitalize">{diff}</span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            );
          }

          // --- Normal Stat Cards ---
          if (stat.title === "Ranks") {
            const Icon = stat.icon;
            const { globalRank, entityRank, entity } = dashboardData.leaderboardDetails;

            const isGlobalUnset = globalRank === -1;
            const isCountryUnset = entityRank === -1;
            const noRank = isGlobalUnset && isCountryUnset;

            let rankMessage = "";
            if (noRank) rankMessage = "No rank data available";
            else if (isGlobalUnset) rankMessage = "Global rank not set";
            else if (isCountryUnset) rankMessage = `${entity ?? "Country"} rank not set`;

            return (
              <Card key={idx} className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  {Icon ? <Icon className={`h-4 w-4 ${stat.color}`} /> : null}
                </CardHeader>

                <CardContent>
                  {noRank || isGlobalUnset || isCountryUnset ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {rankMessage}
                    </p>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      {stat.subtext && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          {stat.subtext}
                          {stat.flag && <span>{stat.flag}</span>}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            );
          }

          // Other cards (Solved, Streak)
          const Icon = stat.icon;
          return (
            <Card key={idx} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {Icon ? <Icon className={`h-4 w-4 ${stat.color}`} /> : null}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Activity Heatmap */}
      <motion.div
        className="lg:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Submissions
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="ml-2 bg-green-500/10 text-green-500 text-xs font-medium px-2 py-0.5 rounded-full"
                >
                  {dashboardData.heatmap.reduce((total, h) => total + h.count, 0)} total
                </motion.span>
              </CardTitle>
            </div>
            <CardDescription>Your accepted submissions over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarHeatmap data={dashboardData.heatmap} />
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

          <CardContent className="space-y-2">
            {/* Header Row */}
            <div className="grid grid-cols-5 text-xs font-medium text-muted-foreground border-b border-border pb-2">
              <div>Title</div>
              <div>Difficulty</div>
              <div>Status</div>
              <div>Language</div>
              <div className="text-right">Time</div>
            </div>

            {/* Activity Rows */}
            {dashboardData.recentActivities.map((activity, index) => (
              <div
                key={index}
                className="grid grid-cols-5 items-center py-2 text-sm border-b border-border last:border-none"
              >
                {/* Problem Title */}
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
                    variant={
                      activity.status.toLowerCase() === "accepted" ? "default" : "outline"
                    }
                    className="text-xs capitalize"
                  >
                    {activity.status}
                  </Badge>
                </div>

                {/* Language */}
                <div>
                  <Badge
                    variant="outline"
                    className="text-xs capitalize"
                  >
                    {activity.language ? activity.language : "Unknown"}
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
    </div>
  );
}