"use client"
import React from "react"
import { motion as Motion } from "framer-motion"

export default function Stats() {
  const stats = [
    { value: "50+", label: "Active Projects" },
    { value: "2M", label: "Users Worldwide" },
    { value: "85%", label: "Customer Satisfaction" },
  ]

  return (
    <div className="bg-[#002b3d]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </Motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
