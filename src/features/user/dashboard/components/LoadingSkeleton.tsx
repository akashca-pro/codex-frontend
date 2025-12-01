import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const UserDashboardLoadingSkeleton = () => {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto animate-pulse">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stats Grid (4 skeleton cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Heatmap Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Simulate heatmap grid */}
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 84 }).map((_, i) => (
              <Skeleton key={i} className="w-3 h-3 rounded-sm" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Table header */}
          <div className="grid grid-cols-4 text-xs font-medium text-muted-foreground border-b border-border pb-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-3 w-16" />
            ))}
          </div>

          {/* Rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="grid grid-cols-4 items-center py-2 text-sm border-b border-border last:border-none"
            >
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12 justify-self-end" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default UserDashboardLoadingSkeleton
