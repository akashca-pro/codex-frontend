import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { useSelect } from '@/hooks/useSelect'

export default function Hero(){
  const { user } = useSelect();
  const role = user && user.details?.role.toLowerCase();
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="animate-slide-up">
            <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 text-white">
                Welcome to <span className="text-orange-600">CodeX</span>
              </h1>

              <p className="text-xl sm:text-3xl lg:text-4xl font-medium text-white">
                Code. <span className="gradient-text">Collab.</span> Compete.
              </p>
            </div>

            <p className="text-xl mt-5 text-gray-400 mb-8 max-w-3xl mx-auto">
              Master Data Structures, crack Algorithms, and battle developers in real-time. CodeX is your ultimate
              destination to practice, duel, and rise through the leaderboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={
                user.isAuthenticated 
                ? `/problems` 
                : '/login'
              }>
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 neon-glow text-lg px-8 py-3">
                  Start Coding
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
