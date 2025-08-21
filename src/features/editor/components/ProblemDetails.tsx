"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, TrendingUp } from "lucide-react"

interface ProblemDetailsProps {
  problem: {
    id: string
    title: string
    difficulty: "Easy" | "Medium" | "Hard"
    description: string
    constraints: string[]
    examples: Array<{
      input: string
      output: string
      explanation?: string
    }>
    acceptance: string
    submissions: string
    companies: string[]
  }
}

const difficultyColors = {
  Easy: "bg-green-500/10 text-green-500 border-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Hard: "bg-red-500/10 text-red-500 border-red-500/20",
}

export default function ProblemDetails({ problem }: ProblemDetailsProps) {
  return (
    <Card className="h-full border-gray-800 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold">
              {problem.id}. {problem.title}
            </CardTitle>
            <div className="flex items-center gap-3">
              <Badge className={difficultyColors[problem.difficulty]}>{problem.difficulty}</Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{problem.acceptance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{problem.submissions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6 pr-4">
            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: problem.description }}
              />
            </motion.div>

            <Separator />

            {/* Examples */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">Examples</h3>
              {problem.examples.map((example, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium">Example {index + 1}:</h4>
                  <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm space-y-2">
                    <div>
                      <strong>Input:</strong> {example.input}
                    </div>
                    <div>
                      <strong>Output:</strong> {example.output}
                    </div>
                    {example.explanation && (
                      <div>
                        <strong>Explanation:</strong> {example.explanation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            <Separator />

            {/* Constraints */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <h3 className="text-lg font-semibold">Constraints</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {problem.constraints.map((constraint, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="font-mono">{constraint}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Companies */}
            {problem.companies.length > 0 && (
              <>
                <Separator />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <h3 className="text-lg font-semibold">Companies</h3>
                  <div className="flex flex-wrap gap-2">
                    {problem.companies.map((company, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
