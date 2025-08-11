"use client"
import React from "react"
import Navbar from "./Navbar"
import Hero from "./hero"
import Partners from "./partners"
import Stats from "./stats"
import FeatureGrid from "./feature-grid"
import Features from "./features"
import Integration from "./integration"
import Pricing from "./pricing"
import Blog from "./blog"
import CTA from "./cta"
import Footer from "./footer"

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
