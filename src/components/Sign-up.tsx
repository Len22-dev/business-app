"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Logo } from "@/app/shared/logo"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { GoogleForm } from "./GoogleLogin"

export default function RegisterPage({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {

 const [email, setEmail] = useState('')
      const [full_name, setFull_name] = useState('')
      const [password, setPassword] = useState('')
      const [repeatPassword, setRepeatPassword] = useState('')
      const [error, setError] = useState<string | null>(null)
      const [isLoading, setIsLoading] = useState(false)
      const router = useRouter()
    
      const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = createClient()
        setIsLoading(true)
        setError(null)
    
        if (password !== repeatPassword) {
          setError('Passwords do not match')
          setIsLoading(false)
          return
        }
    
        try {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name,
              },
              emailRedirectTo: `${window.location.origin}/auth/confirm`,
            },
          })
          if (error) throw error
          router.push('/auth/sign-up-success')
        } catch (error: unknown) {
          setError(error instanceof Error ? error.message : 'An error occurred')
        } finally {
          setIsLoading(false)
        }
      }

  return (
    <div className="min-h-screen bg-[#002b3d] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <Link href="/" className="flex justify-center text-white text-2xl font-bold">
        <Logo/>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-300">
          Or{" "}
          <Link href="/login" className="font-medium text-emerald-500 hover:text-emerald-400">
            sign in to your existing account
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
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={full_name}
                  onChange={(e) => setFull_name(e.target.value)}
                />
              </div>
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
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repeat Password</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}                
                  />
              </div>              
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating an account...' : 'Sign up'}              
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
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
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
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
