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
import { useForm } from "react-hook-form"
import { z } from "zod"
import { vendorWithContactSchema } from "@/lib/zod/vendorSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateVendor } from "@/hooks/useVendor"
import { TextField } from "@/components/formFields"
import { TextareaField } from "@/components/formComponents/textArea"
import { useToast } from "@/components/ui/use-toast"
import { Form } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Building2, CreditCard} from "lucide-react"

interface AddSupplierModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  businessId: string
}

export function AddSupplierModal({ open, onOpenChange, businessId }: AddSupplierModalProps) {
  const [showContactPerson, setShowContactPerson] = useState(false)
  const { mutate: createVendor, isPending } = useCreateVendor()
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof vendorWithContactSchema>>({
    resolver: zodResolver(vendorWithContactSchema),
    defaultValues: {
      businessId: businessId,
      name: "",
      email: "",
      phone: "",
      address: '',
      taxId: "",
      paymentTerms: '',
      notes: "",
      contactPersonName: '',
      contactPersonEmail: '',
      contactPersonPhone: '',
      isPrimary: true,
      position: ''
    },
  })

  const handleSubmit = (data: z.infer<typeof vendorWithContactSchema>) => {
    // Clear contact person fields if section is not shown
    if (!showContactPerson) {
      data.contactPersonName = ''
      data.contactPersonEmail = ''
      data.contactPersonPhone = ''
      data.position = ''
      data.isPrimary = false
    }

    createVendor({ vendorData: data, businessId }, {
      onSuccess: (response) => {
        const vendorName = response.vendor?.name || data.name;
        const hasContact = response.contact ? " with contact person" : "";
        
        toast({
          title: "Vendor added successfully!",
          description: `Your vendor "${vendorName}" has been added successfully${hasContact}.`,
          variant: "default",
        })
        form.reset()
        setShowContactPerson(false)
        onOpenChange(false)
      },
      onError: (error: { message?: string }) => {
        toast({
          title: "Failed to add vendor!",
          description: error.message || "There was an error adding the vendor. Please try again.",
          variant: "destructive",
        })
      },
    })
  }

  const handleCancel = () => {
    form.reset()
    setShowContactPerson(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-5 w-5" />
            Add New Vendor
          </DialogTitle>
          <DialogDescription>
            Add a new vendor to your system with their contact information and payment terms.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              
              {/* Basic Information Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-4 w-4" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <TextField
                        name="name"
                        label="Supplier Name"
                        placeholder="Enter supplier name"
                        control={form.control}
                        required
                      />
                      {form.formState.errors.name && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <TextField
                        name="email"
                        label="Email Address"
                        placeholder="supplier@company.com"
                        control={form.control}
                        required
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <TextField
                        name="phone"
                        label="Phone Number"
                        placeholder="+234-090-123-4567"
                        control={form.control}
                        required
                      />
                      {form.formState.errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <TextareaField
                      name="address"
                      label="Address"
                      placeholder="Enter supplier address"
                      control={form.control}
                      required
                    />
                    {form.formState.errors.address && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.address.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Business Details Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-4 w-4" />
                    Business Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <TextField
                        name="taxId"
                        label="Tax ID"
                        placeholder="Enter tax identification number"
                        control={form.control}
                      />
                      {form.formState.errors.taxId && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.taxId.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <TextareaField
                        name="paymentTerms"
                        label="Payment Terms"
                        placeholder="e.g., Net 30, COD, etc."
                        control={form.control}
                      />
                    </div>
                  </div>

                  <div>
                    <TextareaField
                      name="notes"
                      label="Notes"
                      placeholder="Additional notes or comments about this supplier"
                      control={form.control}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Person Section */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-4 w-4" />
                      Contact Person
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="contact-person-toggle"
                        checked={showContactPerson}
                        onCheckedChange={setShowContactPerson}
                      />
                      <Label htmlFor="contact-person-toggle" className="text-sm">
                        Add contact person
                      </Label>
                    </div>
                  </div>
                  {showContactPerson && (
                    <p className="text-sm text-muted-foreground">
                      Add a specific contact person for this supplier
                    </p>
                  )}
                </CardHeader>
                
                {showContactPerson && (
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <TextField
                          name="contactPersonName"
                          label="Full Name"
                          placeholder="John Doe"
                          control={form.control}
                        />
                        {form.formState.errors.contactPersonName && (
                          <p className="text-red-500 text-sm mt-1">{form.formState.errors.contactPersonName.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <TextField
                          name="position"
                          label="Position/Title"
                          placeholder="Sales Representative"
                          control={form.control}
                        />
                        {form.formState.errors.position && (
                          <p className="text-red-500 text-sm mt-1">{form.formState.errors.position.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <TextField
                          name="contactPersonEmail"
                          label="Email Address"
                          placeholder="john.doe@company.com"
                          control={form.control}
                        />
                        {form.formState.errors.contactPersonEmail && (
                          <p className="text-red-500 text-sm mt-1">{form.formState.errors.contactPersonEmail.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <TextField
                          name="contactPersonPhone"
                          label="Phone Number"
                          placeholder="+234-090-123-4567"
                          control={form.control}
                        />
                        {form.formState.errors.contactPersonPhone && (
                          <p className="text-red-500 text-sm mt-1">{form.formState.errors.contactPersonPhone.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isPrimary"
                            checked={form.watch("isPrimary")}
                            onCheckedChange={(checked) => form.setValue("isPrimary", checked)}
                          />
                          <Label htmlFor="isPrimary" className="text-sm font-medium">
                            Primary Contact
                          </Label>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {form.watch("isPrimary") ? "Main contact person" : "Secondary contact"}
                        </span>
                        {form.formState.errors.isPrimary && (
                          <p className="text-red-500 text-sm mt-1">{form.formState.errors.isPrimary.message}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {form.formState.errors.root && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{form.formState.errors.root.message}</p>
                </div>
              )}
            </form>
          </Form>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              onClick={form.handleSubmit(handleSubmit)}
              className="w-full sm:w-auto"
            >
              {isPending ? 'Adding Supplier...' : 'Add Supplier'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}