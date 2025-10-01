import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-500/10 text-green-400 border-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Hard: "bg-red-500/10 text-red-400 border-red-500/20",
}

export default function ProblemDetailsComponent({ problem }) {
  if (!problem) {
    return (
      <Card className="h-full border-gray-800 bg-card/50 backdrop-blur-sm flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading problem details...</p>
      </Card>
    )
  }

  return (
    <Card className="h-full border-gray-800 bg-card/50 backdrop-blur-md shadow-lg rounded-2xl">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-extrabold tracking-tight">
              {problem.questionId}. {problem.title}
            </CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge
                className={
                  difficultyColors[problem.difficulty] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
                }
              >
                {problem.difficulty}
              </Badge>
              {problem.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-8 pr-4">
            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div
                className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-foreground/90"
                dangerouslySetInnerHTML={{ __html: problem.description }}
              />
            </motion.div>

            <Separator className="bg-border/50" />

            {/* Examples */}
            {problem.examples?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground/90">Examples</h3>
                {problem.examples.map((example, index) => (
                  <div key={example.Id} className="space-y-3">
                    <h4 className="font-medium text-foreground/80">Example {index + 1}:</h4>
                    <div className="bg-muted/30 border border-border/40 p-4 rounded-xl font-mono text-sm space-y-2 shadow-sm">
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
            )}

            <Separator className="bg-border/50" />

            {/* Constraints */}
            {problem.constraints?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground/90">Constraints</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="font-mono">{constraint}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
