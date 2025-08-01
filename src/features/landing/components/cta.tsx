import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r bg-gray-900 rounded-3xl p-12 neon-border">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
            Ready to <span className="gradient-text">Code & Compete</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Sign up now to join a community of passionate coders. Practice problems, duel in battles, and climb the ranks
            with CodeX.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/user/signup">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 neon-glow text-lg px-8 py-3">
                Join Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
