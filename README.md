This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Business Logic: Sales, Purchases, Inventory, and Accounting

### Sales Workflow
- When a sale is created (status 'completed'):
  - For each sale item:
    - A stock movement record is created (type: 'out', status: 'Confirmed').
    - Inventory is decremented for the product at the relevant location.
  - A transaction record is created (type: 'income').
  - A journal entry and corresponding ledger entries are created:
    - **Debit:** Cash (1000) or Accounts Receivable (1100)
    - **Credit:** Sales Revenue (4000)
    - **Debit:** Cost of Goods Sold (5000), **Credit:** Inventory (1200) for COGS

### Purchase Workflow
- When a purchase is created (status 'completed'):
  - For each purchase item:
    - A stock movement record is created (type: 'in', status: 'Confirmed').
    - Inventory is incremented for the product at the relevant location.
  - A transaction record is created (type: 'expense').
  - A journal entry and corresponding ledger entries are created:
    - **Debit:** Inventory (1200) or Expense (6000)
    - **Credit:** Cash (1000) or Accounts Payable (2000)

### Account Codes/Names
- 1000: Cash
- 1100: Accounts Receivable
- 1200: Inventory
- 2000: Accounts Payable
- 4000: Sales Revenue
- 5000: Cost of Goods Sold
- 6000: Purchases/Expense

### Atomicity
- All updates (stock, inventory, transactions, ledgers) are performed in a single database transaction for consistency.

### Extensibility
- This logic supports future pages for accounts receivable/payable and profit/loss reporting.
