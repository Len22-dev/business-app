import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { 
  businesses, 
  categories, 
  taxRates, 
  settings,
  products,
  inventory,
  customers,
  vendors
} from '../src/lib/drizzle/schema/general';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function seedDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🌱 Seeding database...');

  try {
    const client = postgres(databaseUrl);
    const db = drizzle(client);

    // Create a demo business
    const [demoBusiness] = await db.insert(businesses).values({
      name: 'Demo Business',
      description: 'A sample business for demonstration purposes',
      email: 'demo@business.com',
      phone: '+1-555-0123',
      currency: 'USD',
      timezone: 'America/New_York',
      address: {
        street: '123 Business St',
        city: 'Business City',
        state: 'BC',
        country: 'USA',
        zipCode: '12345'
      }
    }).returning();

    console.log('✅ Created demo business:', demoBusiness.name);

    // Create default categories
    const defaultCategories = [
      // Product categories
      { name: 'Electronics', type: 'product', description: 'Electronic devices and accessories' },
      { name: 'Clothing', type: 'product', description: 'Apparel and fashion items' },
      { name: 'Books', type: 'product', description: 'Books and publications' },
      { name: 'Home & Garden', type: 'product', description: 'Home improvement and garden supplies' },
      
      // Expense categories
      { name: 'Office Supplies', type: 'expense', description: 'Office equipment and supplies' },
      { name: 'Marketing', type: 'expense', description: 'Marketing and advertising expenses' },
      { name: 'Travel', type: 'expense', description: 'Business travel expenses' },
      { name: 'Utilities', type: 'expense', description: 'Utility bills and services' },
      { name: 'Professional Services', type: 'expense', description: 'Legal, accounting, and consulting fees' },
      
      // Income categories
      { name: 'Product Sales', type: 'income', description: 'Revenue from product sales' },
      { name: 'Service Revenue', type: 'income', description: 'Revenue from services' },
      { name: 'Interest Income', type: 'income', description: 'Interest earned on investments' },
    ];

    const createdCategories = await db.insert(categories).values(
      defaultCategories.map(cat => ({
        ...cat,
        businessId: demoBusiness.id,
      }))
    ).returning();

    console.log('✅ Created default categories:', createdCategories.length);

    // Create default tax rates
    const defaultTaxRates = [
      { name: 'Sales Tax', rate: '0.0825', type: 'sales', isDefault: true },
      { name: 'VAT', rate: '0.20', type: 'sales', isDefault: false },
      { name: 'Income Tax', rate: '0.25', type: 'income', isDefault: true },
    ];

    const createdTaxRates = await db.insert(taxRates).values(
      defaultTaxRates.map(tax => ({
        ...tax,
        businessId: demoBusiness.id,
      }))
    ).returning();

    console.log('✅ Created default tax rates:', createdTaxRates.length);

    // Create default settings
    const defaultSettings = [
      { key: 'invoice_prefix', value: 'INV', description: 'Prefix for invoice numbers' },
      { key: 'invoice_next_number', value: 1001, description: 'Next invoice number' },
      { key: 'sale_prefix', value: 'SALE', description: 'Prefix for sale numbers' },
      { key: 'sale_next_number', value: 1001, description: 'Next sale number' },
      { key: 'purchase_prefix', value: 'PO', description: 'Prefix for purchase order numbers' },
      { key: 'purchase_next_number', value: 1001, description: 'Next purchase order number' },
      { key: 'default_payment_terms', value: 30, description: 'Default payment terms in days' },
      { key: 'low_stock_threshold', value: 10, description: 'Default low stock threshold' },
      { key: 'enable_inventory_tracking', value: true, description: 'Enable inventory tracking by default' },
      { key: 'default_tax_rate_id', value: createdTaxRates[0].id, description: 'Default tax rate for sales' },
    ];

    await db.insert(settings).values(
      defaultSettings.map(setting => ({
        ...setting,
        businessId: demoBusiness.id,
      }))
    );

    console.log('✅ Created default settings');

    // Create sample products
    const electronicsCategory = createdCategories.find(c => c.name === 'Electronics');
    const clothingCategory = createdCategories.find(c => c.name === 'Clothing');

    const sampleProducts = [
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        sku: 'WBH-001',
        unitPrice: '99.99',
        costPrice: '45.00',
        categoryId: electronicsCategory?.id,
        specifications: {
          color: 'Black',
          weight: 250,
          warranty: '2 years',
          features: ['Noise Cancellation', 'Bluetooth 5.0', '30-hour battery']
        }
      },
      {
        name: 'Smartphone Case',
        description: 'Protective case for smartphones',
        sku: 'SPC-001',
        unitPrice: '24.99',
        costPrice: '8.00',
        categoryId: electronicsCategory?.id,
        specifications: {
          material: 'Silicone',
          colors: ['Black', 'Blue', 'Red'],
          compatibility: ['iPhone 14', 'iPhone 15']
        }
      },
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt',
        sku: 'CTS-001',
        unitPrice: '19.99',
        costPrice: '7.50',
        categoryId: clothingCategory?.id,
        specifications: {
          material: '100% Cotton',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['White', 'Black', 'Navy']
        }
      },
    ];

    const createdProducts = await db.insert(products).values(
      sampleProducts.map(product => ({
        ...product,
        businessId: demoBusiness.id,
      }))
    ).returning();

    console.log('✅ Created sample products:', createdProducts.length);

    // Create inventory records for products
    const inventoryRecords = createdProducts.map(product => ({
      businessId: demoBusiness.id,
      productId: product.id,
      quantity: Math.floor(Math.random() * 100) + 20, // Random quantity between 20-120
      reorderLevel: 10,
      maxStockLevel: 200,
      location: 'Main Warehouse',
    }));

    await db.insert(inventory).values(inventoryRecords);

    console.log('✅ Created inventory records');

    // Create sample customers
    const sampleCustomers = [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0101',
        company: 'Smith Enterprises',
        billingAddress: {
          street: '456 Customer Ave',
          city: 'Customer City',
          state: 'CC',
          country: 'USA',
          zipCode: '54321'
        },
        paymentTerms: 30,
        creditLimit: '5000.00'
      },
      {
        name: 'Jane Doe',
        email: 'jane.doe@email.com',
        phone: '+1-555-0102',
        company: 'Doe Industries',
        billingAddress: {
          street: '789 Client St',
          city: 'Client City',
          state: 'CL',
          country: 'USA',
          zipCode: '67890'
        },
        paymentTerms: 15,
        creditLimit: '10000.00'
      },
    ];

    const createdCustomers = await db.insert(customers).values(
      sampleCustomers.map(customer => ({
        ...customer,
        businessId: demoBusiness.id,
      }))
    ).returning();

    console.log('✅ Created sample customers:', createdCustomers.length);

    // Create sample vendors
    const sampleVendors = [
      {
        name: 'Tech Supplier Inc.',
        email: 'orders@techsupplier.com',
        phone: '+1-555-0201',
        company: 'Tech Supplier Inc.',
        address: {
          street: '123 Supplier Blvd',
          city: 'Supplier City',
          state: 'SC',
          country: 'USA',
          zipCode: '11111'
        },
        paymentTerms: 30
      },
      {
        name: 'Fashion Wholesale',
        email: 'sales@fashionwholesale.com',
        phone: '+1-555-0202',
        company: 'Fashion Wholesale Ltd.',
        address: {
          street: '456 Wholesale Way',
          city: 'Fashion City',
          state: 'FC',
          country: 'USA',
          zipCode: '22222'
        },
        paymentTerms: 45
      },
    ];

    const createdVendors = await db.insert(vendors).values(
      sampleVendors.map(vendor => ({
        ...vendor,
        businessId: demoBusiness.id,
      }))
    ).returning();

    console.log('✅ Created sample vendors:', createdVendors.length);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`Demo business ID: ${demoBusiness.id}`);
    
    await client.end();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };