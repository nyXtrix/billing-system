# Database Seeders

This folder contains seed data for populating the database with sample data.

## Seeder Files

### 1. `products.seeder.ts`
Seeds the products table with 10 sample products:
- 1 KG PET BOX
- 1/4 KG PET BOX
- 2C PRINTED POLYBAG
- 3 COLOUR PRINTED BAG
- 4 COLOUR PRINTED BAG
- BLACK LDPE POLYBAG
- AUSTRALIAN MANS POLY SHEET
- TRANSPARENT POLYBAG
- ZIPPER POUCH
- STAND UP POUCH

### 2. `customers.seeder.ts`
Seeds the customers table with 8 sample customers including:
- AATREYA EXPORT
- ABARNA EXPORTS
- FABRIC SOLUTIONS INC
- A.K.R GARMENTS
- And 4 more...

### 3. `orders.seeder.ts`
Seeds sample orders with complete order head and order details:
- 2 complete sample orders
- Each with multiple order line items
- Includes all required fields

## Running Seeders

### Run all seeders:
```bash
npm run db:seed
```

This will:
1. Seed all products
2. Seed all customers
3. Seed sample orders

### Run individual seeders:
```typescript
import { seedProducts } from './src/seeders/products.seeder';
import { seedCustomers } from './src/seeders/customers.seeder';
import { seedOrders } from './src/seeders/orders.seeder';

// Run specific seeder
await seedProducts();
```

## Adding New Seeders

1. Create a new file in `src/seeders/` (e.g., `mydata.seeder.ts`)
2. Export an async function that inserts data
3. Add it to `src/seeders/index.ts`

Example:
```typescript
import { query } from '../lib/db';

export async function seedMyData() {
  console.log('Seeding my data...');
  
  const data = [
    { field1: 'value1', field2: 'value2' },
    // ... more data
  ];

  for (const item of data) {
    await query('INSERT INTO my_table (field1, field2) VALUES (?, ?)', 
      [item.field1, item.field2]
    );
  }

  console.log(`✓ Seeded ${data.length} items`);
}
```

## Notes

- Seeders use `ON DUPLICATE KEY UPDATE` for products to avoid duplicates
- Orders are created with sequential order numbers
- All seeders handle errors gracefully
- Database connection is automatically closed after seeding
