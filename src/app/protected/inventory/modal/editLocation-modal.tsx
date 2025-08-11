"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit } from "lucide-react"

interface Location {
 // id: number
  name: string
  description: string
  address: string
}

interface EditLocationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  location: Location
}

export function EditLocationModal({ open, onOpenChange, location }: EditLocationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: ""
  })



  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || "",
        description: location.description || "",
        address: location.address || "",
      })
    }
  }, [location])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Updating location:", formData)
    onOpenChange(false)
  }

  if (!location) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Location
          </DialogTitle>
          <DialogDescription>Update location information and settings.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Location Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter location name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter location description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Location Address</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-16 h-8 p-1 border rounded"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Location</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
