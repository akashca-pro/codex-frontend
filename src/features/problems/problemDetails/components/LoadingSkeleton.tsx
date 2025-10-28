import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProblemDetailsPageSkeleton() {
  return (
    <div className="w-full h-screen flex flex-col bg-background text-white">
      {/* Toolbar Skeleton */}
      <div className="flex items-center justify-between px-4 py-2 bg-card/30 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-6 w-px bg-gray-800" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-28 rounded" />
          <Skeleton className="h-8 w-28 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 flex-1">
        {/* Problem Details */}
        <div className="col-span-3 border-r border-gray-800">
          <Card className="h-full border-none bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>

        {/* Editor + Test Case Panel */}
        <div className="col-span-6 flex flex-col border-r border-gray-800">
          {/* Editor Skeleton */}
          <div className="flex-1">
            <Card className="h-full border-none bg-card/30 backdrop-blur-sm">
              <CardContent className="p-0">
                <Skeleton className="h-full w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Test Case Panel Skeleton */}
          <div className="h-64 border-t border-gray-800">
            <Card className="h-full border-none bg-card/30 backdrop-blur-sm rounded-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Notes Panel Skeleton */}
        <div className="col-span-3">
          <Card className="h-full border-none bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
