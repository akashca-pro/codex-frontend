import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import StatCard from "./components/StatCard"
import LatencyChart from "./components/LatencyChart"
import ServiceHealthCard from "./components/ServiceHealthCard"
import { FileText, Swords, Code, Users, Activity, Database, Shield } from "lucide-react"

interface DashboardStats {
  totalSubmissions: {
    count: number
    todayCount: number
    languages: { name: string; count: number; color: string }[]
  }
  totalBattles: {
    count: number
    todayCount: number
  }
  totalProblems: {
    count: number
    todayCount: number
  }
  totalUsers: {
    count: number
    activeToday: number
  }
}

interface ServiceHealth {
  name: string
  status: "UP" | "DOWN"
  lastChecked: string
  responseTime: number
  icon: any
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [services, setServices] = useState<ServiceHealth[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - replace with real API calls
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStats({
        totalSubmissions: {
          count: 45672,
          todayCount: 1247,
          languages: [
            { name: "Python", count: 18500, color: "#3776ab" },
            { name: "JavaScript", count: 12300, color: "#f7df1e" },
            { name: "C++", count: 8900, color: "#00599c" },
            { name: "Java", count: 5972, color: "#ed8b00" },
          ],
        },
        totalBattles: {
          count: 8934,
          todayCount: 156,
        },
        totalProblems: {
          count: 2847,
          todayCount: 12,
        },
        totalUsers: {
          count: 23456,
          activeToday: 3421,
        },
      })

      setServices([
        {
          name: "auth-user-service",
          status: "UP",
          lastChecked: "2 mins ago",
          responseTime: 45,
          icon: Shield,
        },
        {
          name: "problem-service",
          status: "UP",
          lastChecked: "1 min ago",
          responseTime: 32,
          icon: Code,
        },
        {
          name: "battle-service",
          status: "DOWN",
          lastChecked: "5 mins ago",
          responseTime: 0,
          icon: Swords,
        },
        {
          name: "submission-service",
          status: "UP",
          lastChecked: "3 mins ago",
          responseTime: 67,
          icon: FileText,
        },
        {
          name: "notification-service",
          status: "UP",
          lastChecked: "1 min ago",
          responseTime: 23,
          icon: Activity,
        },
        {
          name: "database-service",
          status: "UP",
          lastChecked: "30 secs ago",
          responseTime: 12,
          icon: Database,
        },
      ])

      setIsLoading(false)
    }

    fetchData()
  }, [])

  const refreshServiceHealth = async (serviceName: string) => {
    setServices((prev) =>
      prev.map((service) => (service.name === serviceName ? { ...service, lastChecked: "Checking..." } : service)),
    )

    // Simulate health check
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setServices((prev) =>
      prev.map((service) =>
        service.name === serviceName
          ? {
              ...service,
              lastChecked: "Just now",
              status: Math.random() > 0.2 ? "UP" : "DOWN",
              responseTime: Math.floor(Math.random() * 100) + 10,
            }
          : service,
      ),
    )
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor platform performance and health</p>
      </motion.div>

      {/* Top Stats Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <StatCard
          title="Total Submissions"
          count={stats?.totalSubmissions.count || 0}
          todayCount={stats?.totalSubmissions.todayCount || 0}
          icon={FileText}
          isLoading={isLoading}
          languages={stats?.totalSubmissions.languages}
        />

        <StatCard
          title="Total Battles"
          count={stats?.totalBattles.count || 0}
          todayCount={stats?.totalBattles.todayCount || 0}
          icon={Swords}
          isLoading={isLoading}
        />

        <StatCard
          title="Total Problems"
          count={stats?.totalProblems.count || 0}
          todayCount={stats?.totalProblems.todayCount || 0}
          icon={Code}
          isLoading={isLoading}
        />

        <StatCard
          title="Total Users"
          count={stats?.totalUsers.count || 0}
          todayCount={stats?.totalUsers.activeToday || 0}
          todayLabel="Active Today"
          icon={Users}
          isLoading={isLoading}
        />
      </motion.div>

      {/* gRPC Latency Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <LatencyChart isLoading={isLoading} />
      </motion.div>

      {/* Microservices Health Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-6">Microservices Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceHealthCard
              key={service.name}
              service={service}
              onRefresh={() => refreshServiceHealth(service.name)}
              isLoading={isLoading}
              delay={index * 0.1}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
