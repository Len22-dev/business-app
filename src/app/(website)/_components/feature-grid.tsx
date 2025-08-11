"use client"
import React from "react"
import { motion as Motion } from "framer-motion"
import Image from "next/image"

export default function FeatureGrid() {
  const features = [
    {
      title: "Task Management",
      description: "Simple and intuitive project task tracking",
      image: "/Image3.png",
    },
    {
      title: "Customizable Workflows",
      description: "Adapt processes to match your team's needs",
      image: "/Image2.png",
    },
    {
      title: "Time Tracking",
      description: "Monitor progress and optimize productivity",
      image: "/Image1.png",
    },
    {
      title: "All-in-one place",
      description: "Manage projects from multiple projects in one platform",
      image: "/Image3.png",
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
          <h2 className="text-3xl text-balance md:text-4xl font-bold text-emerald-900 mb-4">
            Everything You Need To Keep You Business On The Right Track
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
