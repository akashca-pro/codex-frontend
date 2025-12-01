import { motion } from "framer-motion"
import { DashboardHeader } from './components/DashboardHeader'
import { DashboardSkeleton } from "./components/DashboardSkeleton"
import { ProblemStats } from './components/ProblemStats'
import { SubmissionStats } from "./components/SubmissionStats"
import { UserStats } from "./components/UserStats"
import { CollabStats } from "./components/CollabStats"
import { useAdminDashboardQuery } from '@/apis/dashboard/admin'

export function AdminDashboardNew() {
  const { data : dashboardData, isLoading, isFetching, refetch, isError } = useAdminDashboardQuery()

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <DashboardHeader onRefresh={refetch} isLoading={isFetching} />

      {isLoading ? (
        <DashboardSkeleton />
      ) : isError ? (
        <div className="text-center text-muted-foreground">Failed to load dashboard data</div>
      ) : dashboardData ? (
        <motion.div className="space-y-8">
          {/* Problem Stats */}
          <ProblemStats
            totalProblems={dashboardData.data.problemSubmissionStats.problemStats.totalProblems ?? 0}
            todaysProblems={dashboardData.data.problemSubmissionStats.problemStats.todaysProblems ?? 0}
            difficultyWise={dashboardData.data.problemSubmissionStats.problemStats.difficultyWise ?? []}
            delay={0}
          />

          {/* Submission Stats */}
          <SubmissionStats
            totalSubmissions={dashboardData.data.problemSubmissionStats.submissionStats.totalSubmissions ?? 0}
            todaysSubmissions={dashboardData.data.problemSubmissionStats.submissionStats.todaysSubmissions ?? 0}
            languageWise={dashboardData.data.problemSubmissionStats.submissionStats.languageWise ?? []}
            delay={0.2}
          />

          {/* User Stats */}
          <UserStats
            totalUsers={dashboardData.data.userStats.totalUsers ?? 0}
            todaysUsers={dashboardData.data.userStats.todaysUsers ?? 0}
            delay={0.4}
          />

          {/* Collaboration Stats */}
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-4 text-xl font-semibold"
            >
              Collaboration Stats
            </motion.h2>
            <CollabStats
              total={dashboardData.data.collabStats.total ?? { active: 0, ended: 0, offline: 0 }}
              today={dashboardData.data.collabStats.today ?? { active: 0, ended: 0, offline: 0 }}
              delay={0.6}
            />
          </div>
        </motion.div>
      ) : null}
    </div>
  )
}