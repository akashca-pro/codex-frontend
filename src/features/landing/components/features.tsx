import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, Users, Brain, Trophy } from "lucide-react"

const features = [
  {
    icon: Code2,
    title: "Practice with Purpose",
    description: "Sharpen your skills with handpicked problems in arrays, strings, trees, graphs, and core algorithms.",
  },
  {
    icon: Brain,
    title: "Smart AI Hints",
    description: "Stuck mid problem? Get context aware hints based on your code and unlock the next logical step without breaking your learning flow.",
  },
  {
    icon: Users,
    title: "Collaborative Code Editor",
    description: "Pair up, share code, and learn together with our blazing-fast real-time code editor and compiler.",
  },
  {
    icon: Trophy,
    title: "Leaderboard & Rankings",
    description: "Track your global and country rank. Improve your score, level up, and dominate the charts.",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Why Code with <span className="gradient-text">CodeX</span>?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            CodeX empowers you to practice smart, compete hard, and collaborate globally — all in one powerful platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
        <Card
          key={index}
          className="neon-border bg-gray-900 hover:bg-gray-900 transition-all duration-300 rounded-xl"
        >
          <CardHeader>
            <feature.icon className="w-12 h-12 text-orange-500 mb-4" />
            <CardTitle className="text-white">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-400">{feature.description}</CardDescription>
          </CardContent>
        </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
