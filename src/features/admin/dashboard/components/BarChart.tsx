import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface BarChartProps {
  title: string
  description?: string
  data: Array<Record<string, any>>
  xKey: string
  yKey: string
  color?: string
  height?: number
}

export function BarChart({ title, description, data, xKey, yKey, color = "#22c55e", height = 300 }: BarChartProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey={xKey} stroke="rgba(255, 255, 255, 0.5)" />
            <YAxis stroke="rgba(255, 255, 255, 0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "white" }}
            />
            <Legend />
            <Bar dataKey={yKey} fill={color} radius={[8, 8, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
