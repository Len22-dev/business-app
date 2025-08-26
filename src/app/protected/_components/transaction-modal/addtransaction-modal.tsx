import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Receipt, Plus, Minus, Calculator, AlertCircle, DollarSign, ArrowBigUp, List, CurrencyIcon, LucideBookMarked } from "lucide-react";
import { transactionFormSchemas, TransactionFormData } from "@/lib/zod/transactionSchema";
import { useCreateTransaction } from "@/hooks/useTransaction";
import { useToast } from "@/components/ui/use-toast";
import { CategorySelector } from "../products/modal/category-selector";
import { SelectField } from "@/components/formComponents/selectFields";
import { TextField } from "@/components/formFields";
import { TextareaField } from "@/components/formComponents/textArea";

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId: string;
  userId: string; 
}

export function AddTransactionModal({ open, onOpenChange, businessId, userId }: AddTransactionModalProps) {
  const { mutate: createTransaction, isPending } = useCreateTransaction();
  const { toast } = useToast();
  console.log('business Id:', businessId, 'user Id:', userId);
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchemas),
    defaultValues: {
      businessId: businessId,
      item: "",
      categoryId: "",
      description: "",
      unitAmount: 0,
      quantity: 1,
      taxAmount: 0,
      discountAmount: 0,
      transactionType: "expense",
      entityType: "vendor",
      transactionStatus: "draft",
      transactionDate: new Date(),
      referenceNumber: "",
      receiptUrl: "",
      createdBy: userId,
    },
  });

  const watchedValues = form.watch(["unitAmount", "quantity", "taxAmount", "discountAmount"]);
  const [unitAmount, quantity, taxAmount, discountAmount] = watchedValues;

  // Calculate subtotal and total
  const subtotalAmount = (unitAmount || 0) * (quantity || 1);
  const totalAmount = subtotalAmount + (taxAmount || 0) - (discountAmount || 0);

  React.useEffect(() => {
    form.setValue("totalAmount", totalAmount);
  }, [totalAmount, form]);

  const onSubmit = (data: TransactionFormData) => {
    createTransaction({ transactionData: data, businessId }, {
      onSuccess: () => {
        toast({
          title: "Transaction created",
          description: "Your transaction has been successfully created.",
          variant: "default",
        });
        form.reset();
        onOpenChange(false);
      },
      onError: (error: { message?: string }) => {
        console.error('Transaction creation failed:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to create transaction.",
          variant: "destructive",
        });
      },
    });
  };

  const entityTypes = [
    { value: "customer", label: "Customer", icon: Plus, color: "text-green-600" },
    { value: "vendor", label: "Vendor", icon: Minus, color: "text-red-600" },
    { value: "bank", label: "Bank", icon: DollarSign, color: "text-blue-600" },
    { value: "product", label: "Product", icon: AlertCircle, color: "text-orange-600" },
    { value: "employee", label: "Employee", icon: LucideBookMarked, color: "text-purple-600" },
    { value: "location", label: "Location", icon: CurrencyIcon, color: "text-teal-600" },
    { value: "other", label: "Other", icon: List, color: "text-gray-600" },
  ];

  const transactionTypes = [
    { value: "sales", label: "Sales", icon: Plus },
    { value: "expense", label: "Expense", icon: Minus },
    { value: "payment", label: "Payment", icon: DollarSign },
    { value: "payroll", label: "Payroll", icon: LucideBookMarked },
    { value: "purchase", label: "Purchase", icon: CurrencyIcon },
    { value: "journal", label: "Journal", icon: List },
    { value: "transfer", label: "Transfer", icon: ArrowBigUp },
  ];

  const statusOptions = [
    { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "approved", label: "Approved", color: "bg-green-100 text-green-800" },
    { value: "completed", label: "Completed", color: "bg-blue-100 text-blue-800" },
    { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
    { value: "cancelled", label: "Cancelled", color: "bg-gray-100 text-gray-800" },
    { value: "failed", label: "Failed", color: "bg-red-100 text-red-800" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] flex flex-col p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Receipt className="h-6 w-6" />
              Add New Transaction
            </DialogTitle>
            <DialogDescription>
              Record a new business transaction with all necessary details.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
                {/* Transaction Type & Status Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SelectField
                    control={form.control}
                    name="transactionType"
                    label="Transaction Type"
                    options={transactionTypes}
                    required
                  />
                  <SelectField
                    control={form.control}
                    name="transactionStatus"
                    label="Transaction Status"
                    options={statusOptions}
                    required
                  />
                  <SelectField
                    control={form.control}
                    name="entityType"
                    label="Entity Type"
                    options={entityTypes}
                    required
                  />
                </div>

                {/* Item Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Item Details</h3>
                    <Separator className="flex-1" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <TextField
                      control={form.control}
                      name="item"
                      label="Item Name"
                      placeholder="Enter item name"
                      required={true}
                    />

                    <CategorySelector
                      businessId={businessId}
                      onCategoryChange={(categoryId) => {
                        form.setValue("categoryId", categoryId || "", { 
                          shouldValidate: true,
                          shouldDirty: true 
                        });
                      }}
                      label="Category *"
                      placeholder="Select a category"
                      required={true}
                      error={form.formState.errors.categoryId?.message}
                      className="w-full"
                    />
                  </div>

                  <TextareaField
                    control={form.control}
                    name="description"
                    label="Description"
                    placeholder="Enter detailed description"
                  />

                  {/* Error Messages */}
                  {form.formState.errors.categoryId && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.categoryId.message}</p>
                  )}
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
                  )}
                </div>

                {/* Financial Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Financial Details</h3>
                    <Calculator className="h-5 w-5" />
                    <Separator className="flex-1" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <TextField
                        control={form.control}
                        name="unitAmount"
                        label="Unit Amount *"
                        placeholder="0.00"
                        type="number"
                      />
                      {form.formState.errors.unitAmount && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.unitAmount.message}</p>
                      )}
                    </div>

                    <div>
                      <TextField
                        control={form.control}
                        name="quantity"
                        label="Quantity"
                        placeholder="1"
                        type="number"
                        required
                      />
                      {form.formState.errors.quantity && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.quantity.message}</p>
                      )}
                    </div>

                    <div>
                      <TextField
                        control={form.control}
                        name="taxAmount"
                        label="Tax Amount"
                        placeholder="0.00"
                        type="number"
                      />
                      {form.formState.errors.taxAmount && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.taxAmount.message}</p>
                      )}
                    </div>

                    <div>
                      <TextField
                        control={form.control}
                        name="discountAmount"
                        label="Discount Amount"
                        placeholder="0.00"
                        type="number"
                      />
                      {form.formState.errors.discountAmount && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.discountAmount.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Calculation Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm text-blue-500">
                      <span>Subtotal ({quantity} × &#8358;{unitAmount?.toFixed(2) || '0.00'}):</span>
                      <span className="font-medium">&#8358;{subtotalAmount.toFixed(2)}</span>
                    </div>
                    {taxAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Tax:</span>
                        <span>+&#8358;{taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Discount:</span>
                        <span>-&#8358;{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-blue-600 text-lg font-bold">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">&#8358;{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Additional Information</h3>
                    <Separator className="flex-1" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <FormField
                        control={form.control}
                        name="transactionDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Transaction Date *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  autoFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {form.formState.errors.transactionDate && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.transactionDate.message}</p>
                      )}
                    </div>

                    <div>
                      <TextField
                        control={form.control}
                        name="referenceNumber"
                        label="Reference Number"
                        placeholder="Enter reference number"
                      />
                      {form.formState.errors.referenceNumber && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.referenceNumber.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <TextField
                      control={form.control}
                      name="receiptUrl"
                      label="Receipt URL"
                      placeholder="https://example.com/receipt.pdf"
                    />
                    {form.formState.errors.receiptUrl && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.receiptUrl.message}</p>
                    )}
                  </div>

                  {/* Additional Error Messages */}
                  {form.formState.errors.transactionType && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.transactionType.message}</p>
                  )}
                  {form.formState.errors.transactionStatus && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.transactionStatus.message}</p>
                  )}
                  {form.formState.errors.entityType && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.entityType.message}</p>
                  )}
                </div>

                {form.formState.errors.root && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {form.formState.errors.root.message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button - Inside Form */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                    className="order-2 sm:order-1"
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="order-1 sm:order-2"
                    onClick={(e) => {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }}
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Adding...
                      </div>
                    ) : (
                      "Add Transaction"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}