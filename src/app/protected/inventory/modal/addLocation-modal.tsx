"use client"

import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"
import { useCreateLocation } from "@/hooks/useLocation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createLocationSchema } from "@/lib/zod/businessSchema"
import { useToast } from "@/components/ui/use-toast"
import { TextField } from "@/components/formFields"
import { Form } from "@/components/ui/form"
import { TextareaField } from "@/components/formComponents/textArea"

interface AddLocationModalProps {
  open: boolean
  businessId: string
  onOpenChange: (open: boolean) => void
}

interface LocationType {
  businessId: string
  name: string
  code: string
  description?: string
  address?: string
  isActive: boolean
}

export function AddLocationModal({ open, onOpenChange, businessId }: AddLocationModalProps) {
  const {mutate: createLocation, isPending} = useCreateLocation()
  const {toast} = useToast()

  const form = useForm<LocationType>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: {
      businessId: businessId,
      name: "",
      code:'',
      description: "",
      isActive: true,
    },
  })

  
  const handleSubmit = (data: LocationType) => {
    createLocation({locationData: data, businessId}, {
      onSuccess: () => {
        toast({
          title: "Location added successfully",
          description: "You have successfully added a new location",
          variant: "default",
        })
        form.reset()
        onOpenChange(false)
      },
      onError: (error:{message?: string }) => {
        console.error('Error creating location:', error);
        toast({
          title: "Error adding location",
          description: error.message || "An error occurred while creating the location",
          variant: "destructive",
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Add New Location
          </DialogTitle>
          <DialogDescription>Create a new product location to organize your inventory.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <TextField
              control={form.control}
              name="name"
              label="Location Name"
              placeholder="Enter location name"
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-2">
           <TextField
              control={form.control}
              name="description"
              label="Location Description"
              placeholder="Enter location description"
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
           <TextField
              control={form.control}
              name="code"
              label="Location Code"
              placeholder="Enter location code"
              disabled={isPending}
            />
          </div>

          
            <div className="flex items-center w-full">
             <TextareaField
              control={form.control}
              name="address"
              label="Location Address"
              placeholder="Enter location address"
              disabled={isPending}
            />
            </div>
         

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
            type="submit"
            disabled={isPending}
            >
              { isPending ? "Adding..." : "Add Location"}
            </Button>
          </DialogFooter>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
