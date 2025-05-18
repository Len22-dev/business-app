"use client"
import React from "react"
import { motion as Motion } from "framer-motion"
import Image from "next/image"

export default function FeatureGrid() {
  const features = [
    {
      title: "Task Management",
      description: "Simple and intuitive project task tracking",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Customizable Workflows",
      description: "Adapt processes to match your team's needs",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Time Tracking",
      description: "Monitor progress and optimize productivity",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "All-in-one place",
      description: "Manage projects from multiple projects in one platform",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="bg-white py-24">
      <div className="container mx-auto px-4">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Keep Projects on Track
          </h2>
        </Motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <div className="mb-4">
                <Image
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.title}
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
