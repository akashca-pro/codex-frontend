import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-8 max-w-xl"
      >
        {/* Animated 404 */}
        <motion.h1
          variants={itemVariants}
          animate={{ textShadow: "0px 0px 20px rgba(255,115,0,0.6)" }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.8 }}
          className="text-[7rem] sm:text-[9rem] font-extrabold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent"
        >
          404
        </motion.h1>

        {/* Heading */}
        <motion.h2
          variants={itemVariants}
          className="text-2xl sm:text-3xl font-semibold"
        >
          This route does not exist
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-gray-400 text-lg"
        >
          The page you are trying to access is either broken, removed, or never existed.
        </motion.p>
        
        {/* CTA */}
        <motion.a
          variants={itemVariants}
          href="/"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-black font-bold rounded-xl shadow-xl hover:shadow-2xl transition"
        >
          Back to Home
        </motion.a>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
