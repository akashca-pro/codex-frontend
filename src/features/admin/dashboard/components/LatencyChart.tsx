import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertCircle } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { useAdminGrpcMetricsQuery } from '@/apis/auth-user/dashboard/admin/metrics'

interface LatencyData {
  method: string
  p50: number
  p90: number
  p99: number
  requestCount: number
  errorRate: number
}

interface LatencyChartProps {
  isLoading: boolean
}

export default function LatencyChart({ isLoading }: LatencyChartProps) {
  const { data: apiData, isFetching } = useAdminGrpcMetricsQuery(undefined)

  const latencyData: LatencyData[] =
    apiData?.data.map((item: any) => ({
      method: item.method,
      p50: parseFloat(item.p50),
      p90: parseFloat(item.p90),
      p99: parseFloat(item.p99),
      requestCount: parseInt(item.requestCount, 10),
      errorRate: parseFloat(item.errorRate),
    })) ?? []

  const chartData = latencyData.map(ld => ({
    time: ld.method,
    p50: ld.p50,
    p90: ld.p90,
    p99: ld.p99,
  }))

  if (isLoading || isFetching) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-gray-800 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            gRPC Latency Metrics
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time latency monitoring across all microservices
          </p>
        </CardHeader>
        <CardContent>
          {/* Chart */}
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis
                  fontSize={10}
                  label={{ value: "Latency (ms)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="p50" stroke="#10b981" strokeWidth={2} name="p50" />
                <Line type="monotone" dataKey="p90" stroke="#f59e0b" strokeWidth={2} name="p90" />
                <Line type="monotone" dataKey="p99" stroke="#ef4444" strokeWidth={2} name="p99" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Method Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {latencyData.map((method) => (
              <motion.div
                key={method.method}
                className="p-4 rounded-lg border border-gray-400 bg-muted/20"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm truncate">{method.method}</h4>
                  {method.errorRate > 2 && <AlertCircle className="h-4 w-4 text-destructive" />}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">p50:</span>
                    <span className="text-green-500">{method.p50}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">p90:</span>
                    <span className="text-yellow-500">{method.p90}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">p99:</span>
                    <span className="text-red-500">{method.p99}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Requests:</span>
                    <span>{method.requestCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Error Rate:</span>
                    <Badge
                      variant={method.errorRate > 2 ? "destructive" : "secondary"}
                      className="text-xs px-1 py-0"
                    >
                      {method.errorRate}%
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
