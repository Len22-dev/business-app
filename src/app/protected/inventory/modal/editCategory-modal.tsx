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

interface Category {
 // id: number
  name: string
  description: string
  color: string
}

interface EditCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category
}

export function EditCategoryModal({ open, onOpenChange, category }: EditCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
  })

  const predefinedColors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EF4444",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#EC4899",
    "#6366F1",
  ]

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
    console.log("Updating category:", formData)
    onOpenChange(false)
  }

  if (!category) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Category
          </DialogTitle>
          <DialogDescription>Update category information and settings.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter category description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Category Color</Label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: formData.color }}
              />
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-16 h-8 p-1 border rounded"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-6 h-6 rounded-full border-2 ${
                    formData.color === color ? "border-gray-800" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
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
