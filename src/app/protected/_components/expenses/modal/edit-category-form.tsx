"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EditExpenseCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: any
}

const colorOptions = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Red", value: "#EF4444" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Gray", value: "#6B7280" },
]

export function EditExpenseCategoryModal({ open, onOpenChange, category }: EditExpenseCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        color: category.color || "#3B82F6",
      })
    }
  }, [category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    onOpenChange(false)
  }

  if (!category) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Expense Category</DialogTitle>
          <DialogDescription>Update category information and settings.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter category description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-full h-10 rounded-md border-2 flex items-center justify-center ${
                      formData.color === color.value ? "border-gray-900" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setFormData({ ...formData, color: color.value })}
                  >
                    {formData.color === color.value && (
                      <span className="text-white text-xs font-medium">{color.name}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Category</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
