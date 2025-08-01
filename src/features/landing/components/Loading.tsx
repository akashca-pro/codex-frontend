import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Navbar skeleton */}
        <div className="flex justify-between items-center h-16 mb-8">
          <Skeleton className="h-8 w-32 bg-gray-800" />
          <div className="flex space-x-4">
            <Skeleton className="h-8 w-16 bg-gray-800" />
            <Skeleton className="h-8 w-20 bg-gray-800" />
          </div>
        </div>

        {/* Hero skeleton */}
        <div className="text-center mb-20">
          <Skeleton className="h-16 w-96 mx-auto mb-4 bg-gray-800" />
          <Skeleton className="h-6 w-80 mx-auto mb-8 bg-gray-800" />
          <div className="flex justify-center space-x-4">
            <Skeleton className="h-12 w-32 bg-gray-800" />
            <Skeleton className="h-12 w-32 bg-gray-800" />
          </div>
        </div>

        {/* Features skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 border border-gray-800 rounded-lg">
              <Skeleton className="h-12 w-12 mb-4 bg-gray-800" />
              <Skeleton className="h-6 w-24 mb-2 bg-gray-800" />
              <Skeleton className="h-4 w-full mb-1 bg-gray-800" />
              <Skeleton className="h-4 w-3/4 bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
