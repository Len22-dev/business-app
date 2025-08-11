"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Logo } from "@/app/shared/logo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "./ui/input"
import { createClient } from "@/lib/supabase/client"
import { GoogleForm } from "./GoogleLogin"

export default function LoginPage({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
   const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)  
  const router = useRouter()

 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
   setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      
      // Check if user has any businesses
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        try {
          const response = await fetch(`/api/businesses?userId=${user.id}&limit=1`)
          
          if (response.ok) {
            const data = await response.json()
            
            // If user has no businesses, redirect to business setup
            if (data.businesses && data.businesses.length === 0) {
              router.push('/auth/businessSetup')
              return
            }
          }
        } catch (businessError) {
          console.error('Error checking user businesses:', businessError)
          // If there's an error checking businesses, redirect to business setup to be safe
          router.push('/auth/businessSetup')
          return
        }
      }
      
      // If user has businesses or we couldn't check, redirect to dashboard
      router.push('/protected/dashboard')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-[#002b3d] flex flex-col items-center justify-center w-full py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <Link href="/" className="flex justify-center text-white text-2xl font-bold">
        <Logo/>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-300">
          Or{" "}
          <Link href="/signup" className="font-medium text-emerald-500 hover:text-emerald-400">
            start your 14-day free trial
          </Link>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
         <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="!bg-emerald-600 hover:bg-emerald-700 w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/auth/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1">
                <GoogleForm/>  
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
