import React from "react"
import { motion as Motion} from "framer-motion"

export default function Partners() {
  const partners = [
    { name: "Layers", logo: "layers.svg" },
    { name: "Quotient", logo: "quotient.svg" },
    { name: "Circooles", logo: "circooles.svg" },
    { name: "Hourglass", logo: "hourglass.svg" },
    { name: "Command+R", logo: "command-r.svg" },
  ]

  return (
    <div className="bg-[#002b3d] py-12">
      <div className="container mx-auto px-4">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
        >
          {partners.map((partner, index) => (
            <Motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {partner.name}
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </div>
  )
}
