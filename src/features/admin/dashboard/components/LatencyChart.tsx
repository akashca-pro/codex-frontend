import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertCircle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

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

const mockLatencyData: LatencyData[] = [
  { method: "GetUser", p50: 12, p90: 45, p99: 120, requestCount: 15420, errorRate: 0.2 },
  { method: "CreateSubmission", p50: 89, p90: 234, p99: 567, requestCount: 8934, errorRate: 1.4 },
  { method: "GetProblem", p50: 23, p90: 67, p99: 156, requestCount: 23456, errorRate: 0.1 },
  { method: "StartBattle", p50: 156, p90: 345, p99: 789, requestCount: 2341, errorRate: 2.8 },
  { method: "SubmitSolution", p50: 234, p90: 456, p99: 1234, requestCount: 12456, errorRate: 3.2 },
]

const chartData = [
  { time: "00:00", p50: 45, p90: 120, p99: 280 },
  { time: "04:00", p50: 52, p90: 134, p99: 310 },
  { time: "08:00", p50: 78, p90: 189, p99: 445 },
  { time: "12:00", p50: 123, p90: 267, p99: 567 },
  { time: "16:00", p50: 89, p90: 234, p99: 456 },
  { time: "20:00", p50: 67, p90: 178, p99: 389 },
  { time: "24:00", p50: 45, p90: 120, p99: 280 },
]

export default function LatencyChart({ isLoading }: LatencyChartProps) {
  if (isLoading) {
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border border-gray-800 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            gRPC Latency Metrics
          </CardTitle>
          <p className="text-sm text-muted-foreground">Real-time latency monitoring across all microservices</p>
        </CardHeader>
        <CardContent>
          {/* Chart */}
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%" className=''>
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
            {mockLatencyData.map((method) => (
              <motion.div
                key={method.method}
                className="p-4 rounded-lg border border-gray-400 bg-muted/20"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{method.method}</h4>
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
                    <Badge variant={method.errorRate > 2 ? "destructive" : "secondary"} className="text-xs px-1 py-0">
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
