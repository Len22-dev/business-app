"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Logo } from "@/app/shared/logo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "./ui/input"
import { createBusinessSchema } from "@/lib/zod/businessSchema"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { TextField } from "./formFields"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { TextareaField } from "./formComponents/textArea"
import { SelectField } from "./formComponents/selectFields"

export default function LoginPage({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
 const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)  
  const router = useRouter()
  

  const form = useForm<z.infer <typeof createBusinessSchema>>({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: {
      name: '',
      shortName: '',
      slug: '',
      email: '',
      phone: '',
      address: '',
      businessType: 'Individual',
      industry: '',
      country: 'Nigeria',
      currency: 'NGN',
      timezone: 'GMT+1',
      fiscalYearStart: 1,
      isActive: true,
    },
  })


  // Auto-generate slug from organization name
  const handleOrganizationNameChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    form.setValue('slug', slug)
  }

 const handleSubmit = async (data: z.infer <typeof createBusinessSchema>) => {
    setIsLoading(true)
    setError(null)

    try {
      const businessData = {
       ...data
      }

      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create business')
      }

      const result = await response.json()
      
      if (result.success) {
        // Redirect to dashboard after successful business creation
        router.push('/protected/dashboard')
      } else {
        throw new Error('Failed to create business')
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const industryOptions = [
                    { label: 'Hospitality', value: 'hospitality' },
                    { label: 'Drinks', value: 'drinks' },
                    { label: 'Food', value: 'food' },
                    { label: 'Entertainment', value: 'entertainment' },
                    { label: 'Services', value: 'services' },
                    { label: 'Retail', value: 'retail' },
                    { label: 'Technology', value: 'technology' },
                    { label: 'Manufacturing', value: 'manufacturing' },
                    { label: 'Construction', value: 'construction' },
                    { label: 'Transportation', value: 'transportation' },
                    { label: 'Education', value: 'education' },
                    { label: 'Healthcare', value: 'healthcare' },
                    { label: 'Real Estate', value: 'real-estate' },
                    { label: 'Agriculture', value: 'agriculture' },
                    { label: 'Energy', value: 'energy' },
                  ];

    const countryOptions = [
                    { label: 'Nigeria', value: 'nigeria' },
                    { label: 'Ghana', value: 'ghana' },
                    { label: 'Kenya', value: 'kenya' },
                    { label: 'South Africa', value: 'south-africa' },
                    { label: 'USA', value: 'usa' },
                    { label: 'UK', value: 'uk' },
                    { label: 'Canada', value: 'canada' },
                    { label: 'Australia', value: 'australia' },
    ]

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
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Create Business</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 ">
         <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Business Info</CardTitle>
          <CardDescription>Enter your business details below</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form} >
          <form onSubmit={form.handleSubmit(handleSubmit)} >
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
              <div className="grid gap-2">
              <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme Corp"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        handleOrganizationNameChange(e.target.value)
                      }}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              </div>
              <div className="grid gap-2">
                <TextField
                name="shortName"
                label="Business Short Name"
                placeholder="Acme"
                control={form.control}
                required
                />
              </div>
              </div>
              <div className="grid gap-2">
             <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business URL</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        groweazie.com/
                      </span>
                      <Input
                        placeholder="acme-corp"
                        className="rounded-l-none"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              </div>
              <div className="grid gap-2">
                <TextField
                name="email"
                label="Business Email"
                placeholder="m@example.com"
                control={form.control}
                required
                />
              </div>
              <div className="flex justify-between">
              <div className="grid gap-2 w-full">
                <SelectField
                  name="businessType"
                  label="Business Type"
                  placeholder="Business Type"
                  options={[
                    { label: 'Individual', value: 'individual' },
                    { label: 'Business', value: 'business' },
                  ]}
                  control={form.control}
                  required
                />
              </div>
              <div className="grid gap-2">
                <SelectField
                  name="industry"
                  label="Industry"
                  placeholder="Select Industry"
                  options={industryOptions}
                  control={form.control}
                  required
                />
              </div>
              </div>
              <div className="grid gap-2">
                <SelectField
                  name="country"
                  label="Country"
                  placeholder="Select Country"
                  options={countryOptions}
                  control={form.control}
                  required
                />
              </div>
              <div className="grid gap-2">
                <TextField
                name="phone"
                label="Phone Number"
                placeholder="+234-080-1234-5678"
                control={form.control}
                required
                />
              </div>
              <div className="grid gap-2">
                <TextareaField
                  name="address"
                  label="Address"
                  placeholder="123 Marina St, lagos-Island, Lagos Nigeria"
                  control={form.control}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="!bg-emerald-600 hover:bg-emerald-700 w-full" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Business'}
              </Button>
            </div>
          </form>
          </Form>
        </CardContent>
      </Card>
    </div>
        </div>
      </motion.div>
    </div>
  )
}
