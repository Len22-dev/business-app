"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Logo } from "@/app/shared/logo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Input } from "./ui/input"
import { createClient } from "@/lib/supabase/client"
import { GoogleForm } from "./GoogleLogin"
import { useRouter } from "next/navigation"

export function UpdatePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
        const [password, setPassword] = useState('')
        const [error, setError] = useState<string | null>(null)
        const [isLoading, setIsLoading] = useState(false)
        const router = useRouter()

        const handleForgotPassword = async (e: React.FormEvent) => {
            e.preventDefault()
            const supabase = createClient()
            setIsLoading(true)
            setError(null)

            try {
            const { error } = await supabase.auth.updateUser({ password })
            if (error) throw error
            // Update this route to redirect to an authenticated route. The user already has an active session.
            router.push('/protected')
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
                  <CardTitle className="text-2xl">Reset Your Password</CardTitle>
                  <CardDescription>Please enter your new password below.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleForgotPassword}>
                    <div className="flex flex-col gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="password">New password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="New password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      {error && <p className="text-sm text-red-500">{error}</p>}
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save new password'}
                      </Button>
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
