// Load environment variables FIRST
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

// Import seeders
import { seedProducts } from './products.seeder';
import { seedCustomers } from './customers.seeder';
import { seedOrders } from './orders.seeder';
import { closePool } from '../lib/db';

async function runSeeders() {
  console.log('Starting database seeding...');
  console.log('Database:', process.env.DB_NAME);
  console.log('Host:', process.env.DB_HOST);
  console.log('');

  try {
    // Run seeders in order
    await seedProducts();
    await seedCustomers();
    await seedOrders();

    console.log('');
    console.log('✓ All seeders completed successfully!');
  } catch (error) {
    console.error('✗ Error running seeders:', error);
    process.exit(1);
  } finally {
    await closePool();
    process.exit(0);
  }
}

runSeeders();
