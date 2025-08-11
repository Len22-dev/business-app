"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ImportTransactionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportTransactionsModal({ open, onOpenChange }: ImportTransactionsModalProps) {
  const [selectedAccount, setSelectedAccount] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileFormat, setFileFormat] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Auto-detect format based on file extension
      const extension = file.name.split(".").pop()?.toLowerCase()
      if (extension === "csv") setFileFormat("csv")
      else if (extension === "xlsx" || extension === "xls") setFileFormat("excel")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle file import here
    console.log("Importing transactions:", { selectedAccount, selectedFile, fileFormat })
    onOpenChange(false)
    // Reset form
    setSelectedAccount("")
    setSelectedFile(null)
    setFileFormat("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Bank Transactions</DialogTitle>
          <DialogDescription>
            Import transactions from your bank statement file. Supported formats: CSV, Excel.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account" className="text-right">
                Bank Account
              </Label>
              <div className="col-span-3">
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first-bank-1234">First Bank - ****1234</SelectItem>
                    <SelectItem value="gtbank-5678">GTBank - ****5678</SelectItem>
                    <SelectItem value="access-bank-9012">Access Bank - ****9012</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="format" className="text-right">
                File Format
              </Label>
              <div className="col-span-3">
                <Select value={fileFormat} onValueChange={setFileFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select file format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV File</SelectItem>
                    <SelectItem value="excel">Excel File</SelectItem>
                    <SelectItem value="ofx">OFX File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="file" className="text-right mt-2">
                Statement File
              </Label>
              <div className="col-span-3">
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.xlsx,.xls,.ofx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Card className="border-dashed border-2 hover:border-green-500 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <label htmlFor="file" className="cursor-pointer">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">CSV, Excel, or OFX files up to 10MB</p>
                    </label>
                  </CardContent>
                </Card>
              </div>
            </div>

            {selectedFile && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-sm text-muted-foreground">File Info:</div>
                <div className="col-span-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{selectedFile.name}</span>
                  <span className="text-xs text-muted-foreground">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={!selectedAccount || !selectedFile || !fileFormat}
            >
              Import Transactions
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
