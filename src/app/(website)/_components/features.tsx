"use client"
import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function Features() {
  return (
    <motion.div>
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden"
            >
              <Image
                src="/Image1.png"
                alt="Features Preview"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center bg-emerald-100 rounded-full px-4 py-1">
                <span className="text-emerald-800 text-sm">Why Choose Us</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">All-in-One Solution for Smarter Sales</h2>
              <p className="text-gray-600 text-lg">
                From lead tracking to performance analytics, get everything you need to manage your sales pipeline
                efficiently. Focus on what matters—building relationships and growing revenue.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/get-started"
                  className="bg-emerald-500 text-white px-6 py-3 rounded-md hover:bg-emerald-600 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  href="/why-choose-us"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Why Choose Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div> 
  )
}
