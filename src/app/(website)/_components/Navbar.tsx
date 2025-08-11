"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Logo } from "@/app/shared/logo"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#002b3d]/95 backdrop-blur-sm px-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
            <Link href="/" >
            <Logo/>
            </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <Link href="/features" className="text-white hover:text-emerald-400 transition-colors">
              Features
            </Link>
            <Link href="/resources" className="text-white hover:text-emerald-400 transition-colors">
              Resources
            </Link>
            <Link href="/about" className="text-white hover:text-emerald-400 transition-colors">
              About Us
            </Link>
            <Link href="/auth/login" className="text-white hover:text-emerald-400 transition-colors">
              Log in
            </Link>
            <Link
              href="/auth/sign-up"
              className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-emerald-400 transition-colors">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="text-white block px-3 py-2 rounded-md hover:bg-emerald-500/10">
                Home
              </Link>
              <Link href="/features" className="text-white block px-3 py-2 rounded-md hover:bg-emerald-500/10">
                Features
              </Link>
              <Link href="/resources" className="text-white block px-3 py-2 rounded-md hover:bg-emerald-500/10">
                Resources
              </Link>
              <Link href="/about" className="text-white block px-3 py-2 rounded-md hover:bg-emerald-500/10">
                About Us
              </Link>
              <Link href="/auth/login" className="text-white block px-3 py-2 rounded-md hover:bg-emerald-500/10">
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="bg-emerald-500 text-white block px-3 py-2 rounded-md hover:bg-emerald-600"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
