import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { useSelect } from '@/hooks/useSelect'

export default function CTA() {
  const { user } = useSelect();

  const isAuth = user?.isAuthenticated;

  const heading = isAuth
    ? <>Ready for your <span className="gradient-text">next challenge</span>?</>
    : <>Ready to <span className="gradient-text">Code & Compete</span>?</>;

  const description = isAuth
    ? "Solve new DSA problems, use the live editor for collaboration, and push your rank higher."
    : "Join a growing community of developers who practice daily, review code together, and push each other to improve.";

  const buttonText = isAuth ? "Start Solving" : "Join Now";
  const buttonLink = isAuth ? "/problems" : "/signup";

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r bg-gray-900 rounded-3xl p-12 neon-border">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
            {heading}
          </h2>

          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={buttonLink}>
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 neon-glow text-lg px-8 py-3">
                {buttonText}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
