import { Link } from "react-router-dom"
import { Mail, Github, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 border-t border-gray-800 mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left - Logo & Copyright */}
        <div className="text-gray-400 text-sm text-center md:text-left">
          <p className="text-white font-semibold text-lg">CodeX</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} CodeX. All rights reserved.</p>
        </div>

        {/* Center - Navigation Links */}
        <div className="flex flex-wrap items-center gap-6 justify-center text-sm">
          <Link
            to="/about"
            className="text-gray-400 hover:text-orange-500 transition-all duration-300"
          >
            About
          </Link>
          <Link
            to="/privacy"
            className="text-gray-400 hover:text-orange-500 transition-all duration-300"
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="text-gray-400 hover:text-orange-500 transition-all duration-300"
          >
            Terms
          </Link>
          <Link
            to="/contact"
            className="text-gray-400 hover:text-orange-500 transition-all duration-300"
          >
            Contact
          </Link>
        </div>

        {/* Right - Social Icons */}
        <div className="flex gap-4">
          <Link
            to="mailto:codex.platform.official@gmail.com"
            className="text-gray-400 hover:text-orange-500 transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_6px_#ff7f00]"
          >
            <Mail className="h-5 w-5" />
          </Link>
          <Link
            to="https://github.com"
            target="_blank"
            className="text-gray-400 hover:text-orange-500 transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_6px_#ff7f00]"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            to="https://linkedin.com/in"
            target="_blank"
            className="text-gray-400 hover:text-orange-500 transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_6px_#ff7f00]"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
