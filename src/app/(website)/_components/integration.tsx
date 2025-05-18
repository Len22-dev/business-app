import { motion as Motion } from "framer-motion"
import { Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Integration() {
  const features = [
    {
      title: "Innovation",
      description: "Pioneering solutions to meet modern financial challenges.",
    },
    {
      title: "Transparency",
      description: "Clear and honest communication every step of the way.",
    },
    {
      title: "Empowerment",
      description: "Giving you the tools to make informed financial decisions.",
    },
  ]

  return (
    <div className="bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Seamless Integration with Your Workflow</h2>
            <p className="text-gray-600 text-lg">
              Connect your favorite tools and platforms effortlessly. Our solution integrates with CRMs, email services,
              and communication apps, ensuring a smooth and efficient sales process.
            </p>
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="mt-1 bg-emerald-500 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#"
                className="bg-emerald-500 text-white px-6 py-3 rounded-md hover:bg-emerald-600 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="#"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <Image
                src="/bizzImage.jpeg"
                alt="Integration Preview"
                fill
                className="object-cover"
              />
            </div>
          </Motion.div>
        </div>
      </div>
    </div>
  )
}
