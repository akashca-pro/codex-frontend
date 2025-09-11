import { motion } from "framer-motion"

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        {/* Static 404 Number with gradient */}
        <h1 className="text-[8rem] sm:text-[10rem] font-extrabold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
          404
        </h1>

        {/* Message */}
        <p className="text-xl sm:text-2xl text-gray-400">
          Oops! The page you are looking for cannot be found.
        </p>

        {/* Professional code snippet */}
        <div className="bg-gray-900 rounded-lg p-4 sm:p-6 font-mono text-left overflow-x-auto">
          <code>
            {"// Page not found – please check the URL or navigate home\n"}
            {"const requestedPage = '/unknown';\n"}
            {"console.error('Error: Page not found');"}
          </code>
        </div>

        {/* Call to Action */}
        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-black font-bold rounded-lg shadow-lg hover:shadow-xl transition"
        >
          Go Back Home
        </motion.a>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
