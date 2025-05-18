import { motion as Motion } from "framer-motion"
import Link from "next/link"

export default function CTA() {
  return (
    <div className="bg-[#002b3d] py-24">
      <div className="container mx-auto px-4">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#003a52] rounded-2xl p-12 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Start Managing Your Projects Like a Pro</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Get started with our powerful project management tools and take control of your workflow today.
          </p>
          <Link
            href="#"
            className="inline-flex items-center justify-center bg-emerald-500 text-white px-8 py-3 rounded-md hover:bg-emerald-600 transition-colors"
          >
            Get Started
          </Link>
        </Motion.div>
      </div>
    </div>
  )
}
