"use client"

import type React from "react"

import { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"

interface UploadDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadDocumentModal({ open, onOpenChange }: UploadDocumentModalProps) {
  const [documentName, setDocumentName] = useState("")
  const [documentType, setDocumentType] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!documentName) {
        setDocumentName(file.name)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle document upload logic here
    console.log({
      documentName,
      documentType,
      category,
      description,
      file: selectedFile,
    })
    onOpenChange(false)
    // Reset form
    setDocumentName("")
    setDocumentType("")
    setCategory("")
    setDescription("")
    setSelectedFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>Upload a new document to your document library</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {selectedFile ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm">{selectedFile.name}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Click to upload or drag and drop
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</span>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-name">Document Name</Label>
            <Input
              id="document-name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Enter document name"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="document-type">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="receipt">Receipt</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="statement">Statement</SelectItem>
                  <SelectItem value="tax-document">Tax Document</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="banking">Banking</SelectItem>
                  <SelectItem value="tax">Tax</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this document"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedFile || !documentName || !documentType || !category}>
              Upload Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
