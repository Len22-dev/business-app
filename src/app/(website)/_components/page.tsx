"use client"
import React from "react"
import Navbar from "./website/_components/Navbar"
import Hero from "./website/_components/hero"
import Partners from "./website/_components/partners"
import Stats from "./website/_components/stats"
import FeatureGrid from "./website/_components/feature-grid"
import Features from "./website/_components/features"
import Integration from "./website/_components/integration"
import Pricing from "./website/_components/pricing"
import Blog from "./website/_components/blog"
import CTA from "./website/_components/cta"
import Footer from "./website/_components/footer"

export default function Home() {
  return (
    <main className="container mx-auto  min-h-screen bg-[#002b3d] w-full flex flex-col items-center px-8 overflow-x-hidden gap-2">
      <Navbar/>
      <Hero />
      <Partners />
      <Stats />
      <FeatureGrid />
      <Features />
      <Integration />
      <Pricing />
      <Blog />
      <CTA />
      <Footer/>
    </main>
  )
}
