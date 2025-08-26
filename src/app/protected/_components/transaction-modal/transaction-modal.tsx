"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, DollarSign, Receipt, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data to simulate backend
const mockCustomers: Contact[] = [
  { id: 1, name: "Acme Corporation", type: "customer" },
  { id: 2, name: "Tech Solutions Inc", type: "customer" },
  { id: 3, name: "Global Enterprises", type: "customer" },
  { id: 4, name: "Startup Hub", type: "customer" },
]

const mockVendors: Contact[] = [
  { id: 1, name: "Office Supplies Co", type: "vendor" },
  { id: 2, name: "Software Licensing Ltd", type: "vendor" },
  { id: 3, name: "Marketing Agency Pro", type: "vendor" },
  { id: 4, name: "Equipment Rental Services", type: "vendor" },
]

interface Contact {
  id: number
  name: string
  type: "customer" | "vendor"
}

interface Entry {
  id: string
  type: "sales" | "expenses"
  contact: string
  amount: number
  description: string
  category: string
  date: string
  createdAt: Date
}

interface AutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  type: "customer" | "vendor"
  onAddNew: () => void
}

function AutocompleteInput({ value, onChange, placeholder, type, onAddNew }: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Simulate API call to fetch contacts
  const fetchContacts = useCallback(async (query: string) => {
    setIsLoading(true)
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const contacts = type === "customer" ? mockCustomers : mockVendors
    const filtered = contacts.filter((contact) => contact.name.toLowerCase().includes(query.toLowerCase()))

    setFilteredContacts(filtered)
    setIsLoading(false)
  }, [type])

  useEffect(() => {
    if (value && isOpen) {
      fetchContacts(value)
    } else if (isOpen) {
      setFilteredContacts(type === "customer" ? mockCustomers : mockVendors)
    }
  }, [value, isOpen, fetchContacts, type])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputFocus = () => {
    setIsOpen(true)
    if (!value) {
      setFilteredContacts(type === "customer" ? mockCustomers : mockVendors)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setIsOpen(true)
  }

  const handleSelectContact = (contact: Contact) => {
    onChange(contact.name)
    setIsOpen(false)
  }

  const showAddButton = isOpen && value && filteredContacts.length === 0 && !isLoading

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {isLoading ? (
            <div className="p-3 text-center text-muted-foreground">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              Searching...
            </div>
          ) : filteredContacts.length > 0 ? (
            <div className="py-1">
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <span>{contact.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {contact.type}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          ) : value ? (
            <div className="p-3">
              <div className="text-sm text-muted-foreground mb-2">
                No {type} found for {value}
              </div>
              <button
                onClick={onAddNew}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <Plus className="h-4 w-4" />
                Add {value} as new {type}
              </button>
            </div>
          ) : (
            <div className="p-3">
              <div className="text-sm text-muted-foreground mb-2">No {type}s available</div>
              <button
                onClick={onAddNew}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <Plus className="h-4 w-4" />
                Add new {type}
              </button>
            </div>
          )}
        </div>
      )}

      {showAddButton && (
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
          <button
            onClick={onAddNew}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>
      )}
    </div>
  )
}

export function SalesExpensesForm() {
  const [formType, setFormType] = useState<"sales" | "expenses">("sales")
  const [contactName, setContactName] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [entries, setEntries] = useState<Entry[]>([])

  const handleAddNewContact = () => {
    // In a real app, this would open a modal or navigate to a form
    alert(`Add new ${formType === "sales" ? "customer" : "vendor"}: ${contactName || "New contact"}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newEntry: Entry = {
      id: Date.now().toString(),
      type: formType,
      contact: contactName,
      amount: Number.parseFloat(amount),
      description,
      category,
      date,
      createdAt: new Date(),
    }

    setEntries((prev) => [newEntry, ...prev])
    console.log("Form submitted:", newEntry)

    // Reset form
    setContactName("")
    setAmount("")
    setDescription("")
    setCategory("")
  }

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  const currentEntries = entries.filter((entry) => entry.type === formType)

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {formType === "sales" ? (
                <>
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Sales Entry
                </>
              ) : (
                <>
                  <Receipt className="h-5 w-5 text-red-600" />
                  Expense Entry
                </>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={formType === "sales" ? "default" : "outline"}
                size="sm"
                onClick={() => setFormType("sales")}
                className={cn(formType === "sales" && "bg-green-600 hover:bg-green-700")}
              >
                Sales
              </Button>
              <Button
                variant={formType === "expenses" ? "default" : "outline"}
                size="sm"
                onClick={() => setFormType("expenses")}
                className={cn(formType === "expenses" && "bg-red-600 hover:bg-red-700")}
              >
                Expenses
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact">{formType === "sales" ? "Customer" : "Vendor"} *</Label>
                <AutocompleteInput
                  value={contactName}
                  onChange={setContactName}
                  placeholder={`Search ${formType === "sales" ? "customer" : "vendor"}...`}
                  type={formType === "sales" ? "customer" : "vendor"}
                  onAddNew={handleAddNewContact}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {formType === "sales" ? (
                      <>
                        <SelectItem value="product-sales">Product Sales</SelectItem>
                        <SelectItem value="service-sales">Service Sales</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="other-income">Other Income</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="office-supplies">Office Supplies</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="other-expense">Other Expense</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Enter ${formType === "sales" ? "sale" : "expense"} description...`}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className={cn(
                  "flex-1",
                  formType === "sales" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700",
                )}
                disabled={!contactName || !amount}
              >
                Record {formType === "sales" ? "Sale" : "Expense"}
              </Button>
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {currentEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {formType === "sales" ? (
                <>
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Recent Sales ({currentEntries.length})
                </>
              ) : (
                <>
                  <Receipt className="h-5 w-5 text-red-600" />
                  Recent Expenses ({currentEntries.length})
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>{formType === "sales" ? "Customer" : "Vendor"}</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{new Date(entry.date).toLocaleDateString()}</TableCell>
                    <TableCell>{entry.contact}</TableCell>
                    <TableCell>
                      {entry.category && (
                        <Badge variant="secondary" className="text-xs">
                          {entry.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{entry.description || "—"}</TableCell>
                    <TableCell
                      className={cn("text-right font-medium", formType === "sales" ? "text-green-600" : "text-red-600")}
                    >
                      ${entry.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
