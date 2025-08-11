"use client"

import { LazyMotion, domAnimation, m } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="bg-[#002b3d] min-h-screen ">
        <div className="container mx-auto px-4 py-12">
          {/* Version banner */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center bg-[#003a52] rounded-full px-4 py-1 mb-8"
          >
            <span className="text-white text-sm">Business Management paltform</span>
            <Link href="/whats-new" className="text-emerald-400 text-sm ml-2 hover:underline">
              Read more →
            </Link>
          </m.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <m.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-4xl text-pretty md:text-5xl lg:text-6xl font-bold text-emerald-500 leading-tight">
                Grow Your Business <span className="text-emerald-200 font-semibold">Eazy-Peazy</span>
              </h1>
              <p className="text-emerald-100 text-pretty text-lg md:text-xl max-w-xl">
               Your all-in-one business management platform. Manage sales, inventory, customers, and accounting without login into different accounts. 
                Designed to make managing your business(es) easier.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/get-started"
                  className="bg-emerald-500 text-white px-6 py-3 rounded-md hover:bg-emerald-600 transition-colors inline-flex items-center"
                >
                  Get Started
                </Link>
                <Link
                  href="/features"
                  className="border border-white/20 text-white px-6 py-3 rounded-md hover:bg-white/10 transition-colors inline-flex items-center"
                >
                  Learn More
                </Link>
              </div>
            </m.div>

            <m.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src="/Image1.png"
                  alt="Dashboard Preview"
                  fill
                  className="object-fit object-center rounded-lg"
                  // width={1020}
                  // height={768}
                  priority
                />
              </div>
            </m.div>
          </div>
        </div>
      </div>
    </LazyMotion>
  )
}
