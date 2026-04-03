import { motion } from "framer-motion";

function Home() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center mt-20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-5xl font-bold text-pink-500">
        Welcome to HealthHer 💖
      </h1>

      <p className="mt-4 text-gray-600">
        Your safe space for health & wellness 🌸
      </p>
    </motion.div>
  );
}

export default Home;