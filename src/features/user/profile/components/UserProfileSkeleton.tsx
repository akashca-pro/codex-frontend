import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function UserProfileSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <main className="flex-1 overflow-y-auto p-4">
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar + Basic Info */}
                <div className="flex flex-col items-center md:items-start">
                  <Skeleton className="h-24 w-24 rounded-full mb-4" />

                  <div className="text-center md:text-left space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-36" />
                  </div>

                  {/* Stats Overview */}
                  <div className="mt-6">
                    <Skeleton className="h-5 w-32 mb-3" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Skeleton className="h-16 w-full rounded-lg" />
                      <Skeleton className="h-16 w-full rounded-lg" />
                      <Skeleton className="h-16 w-full rounded-lg" />
                      <Skeleton className="h-16 w-full rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
              <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <Skeleton className="h-5 w-40" />
        </CardTitle>
        <Skeleton className="h-8 w-28 rounded-md" /> {/* Edit button placeholder */}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-3 w-24 mb-2" /> {/* Label */}
            <Skeleton className="h-4 w-40" /> {/* Value */}
          </div>
          <div>
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div>
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div>
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-4 w-36" />
          </div>
          <div>
            <Skeleton className="h-3 w-32 mb-2" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
        </div>
      </main>
    </div>
  )
}
