# Modal Forms Documentation

This document describes the modal forms created for Sales, Expenses, and Purchases, following the pattern established by the `addProduct-modal.tsx` component.

## Overview

The modal forms are built using:
- **React Hook Form** for form management
- **Zod** for schema validation
- **Custom hooks** for API operations
- **Shadcn/UI components** for consistent styling
- **TypeScript** for type safety

## Structure

Each module (Sales, Expenses, Purchases) has three main modal types:
- **Create**: For adding new records
- **Edit**: For updating existing records  
- **View**: For displaying record details (read-only)

## Sales Modals

### Files Created:
- `sales/modal/create-sale-form.tsx`
- `sales/modal/edit-sale-form.tsx`
- `sales/modal/view-sale-form.tsx`

### Features:
- Customer name and contact management
- Payment status and method selection
- Date handling (sale date, due date)
- Amount calculations
- Form validation using `saleFormSchema`
- Integration with `useSales` hooks

### Usage:
```tsx
import { CreateSaleModal } from '@/app/protected/_components/sales/modal'

<CreateSaleModal
  businessId={businessId}
  open={isOpen}
  onOpenChange={setIsOpen}
/>
```

## Expense Modals

### Files Created:
- `expenses/modal/create-expense-form.tsx`
- `expenses/modal/edit-expense-form.tsx`
- `expenses/modal/view-expense-form.tsx`

### Features:
- Amount and description tracking
- Category and vendor selection
- Payment method options
- Receipt URL handling
- Reimbursable and recurring expense flags
- Date management
- Form validation using `createExpenseSchema`
- Integration with `useExpenses` hooks

### Usage:
```tsx
import { CreateExpenseModal } from '@/app/protected/_components/expenses/modal'

<CreateExpenseModal
  businessId={businessId}
  open={isOpen}
  onOpenChange={setIsOpen}
/>
```

## Purchase Modals

### Files Created:
- `purchase/modal/create-purchase-form.tsx`
- `purchase/modal/edit-purchase-form.tsx`
- `purchase/modal/view-purchase-form.tsx`

### Features:
- Vendor and location management
- Automatic total calculation (subtotal + tax - discount)
- Purchase status tracking
- Date handling
- Form validation using `createPurchaseSchema`
- Integration with `usePurchase` hooks

### Usage:
```tsx
import { CreatePurchaseModal } from '@/app/protected/_components/purchase/modal'

<CreatePurchaseModal
  businessId={businessId}
  open={isOpen}
  onOpenChange={setIsOpen}
/>
```

## Common Features

All modal forms include:

### Form Components Used:
- `TextField` - Text and number inputs
- `TextareaField` - Multi-line text areas
- `SelectField` - Dropdown selections
- `DateField` - Date picker with calendar
- `Form` - React Hook Form wrapper

### Validation:
- Zod schema validation
- Real-time form validation
- Error message display
- Required field indicators

### State Management:
- Form reset on modal open/close
- Loading states during API calls
- Success/error toast notifications
- Automatic query invalidation

### Styling:
- Responsive grid layouts
- Consistent spacing and typography
- Loading indicators
- Proper form accessibility

## Integration with Existing Hooks

The modals integrate with existing custom hooks:

### Sales:
- `useCreateSale()` - Create new sales
- `useUpdateSale()` - Update existing sales
- `useSale(id)` - Fetch single sale data

### Expenses:
- `useCreateExpense()` - Create new expenses
- `useUpdateExpense()` - Update existing expenses
- `useExpense(id)` - Fetch single expense data

### Purchases:
- `useCreatePurchase()` - Create new purchases
- `useUpdatePurchase()` - Update existing purchases
- `usePurchase(id)` - Fetch single purchase data

## Schema Integration

The forms use the following Zod schemas:

### Sales:
- `saleFormSchema` - Form validation schema
- Includes customer, payment, and date validation
- Cross-field validation for dates and amounts

### Expenses:
- `createExpenseSchema` - Create form validation
- `updateExpenseSchema` - Update form validation
- Handles optional fields and conditional validation

### Purchases:
- `createPurchaseSchema` - Create form validation
- `updatePurchaseSchema` - Update form validation
- Automatic total calculation validation

## Error Handling

All forms include comprehensive error handling:
- Network error handling
- Validation error display
- User-friendly error messages
- Graceful fallbacks for missing data

## Accessibility

The forms follow accessibility best practices:
- Proper form labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Error announcements

## Customization

The modal forms can be easily customized:

### Styling:
- Modify Tailwind classes for appearance
- Adjust grid layouts for different screen sizes
- Customize color schemes and spacing

### Validation:
- Update Zod schemas for different validation rules
- Add custom validation logic
- Modify error messages

### Fields:
- Add or remove form fields as needed
- Modify field types and options
- Adjust required/optional field settings

## Example Implementation

See `modal-examples.tsx` for a complete example of how to integrate these modals into your components.

## Best Practices

1. **Always provide businessId** - Required for all operations
2. **Handle loading states** - Show appropriate feedback during API calls
3. **Reset forms properly** - Clear form data when modals close
4. **Validate on submit** - Ensure data integrity before API calls
5. **Show user feedback** - Use toast notifications for success/error states
6. **Type safety** - Use TypeScript interfaces for form data

## Future Enhancements

Potential improvements for the modal forms:
- File upload support for receipts/documents
- Bulk operations (create multiple records)
- Advanced filtering and search
- Export functionality
- Print/PDF generation
- Audit trail tracking
- Advanced validation rules
- Integration with external services