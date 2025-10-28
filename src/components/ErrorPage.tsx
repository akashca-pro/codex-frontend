import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

export default function ErrorPage({ refetch }: { refetch?: () => void }) {
  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-6"
      >
        <div className="flex flex-col items-center gap-3">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground">
            We couldn’t load the page. Please try again later.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          {refetch && (
            <Button onClick={refetch}>Try Again</Button>
          )}
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
