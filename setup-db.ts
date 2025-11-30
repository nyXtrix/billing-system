// Load environment variables FIRST before any other imports
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

// Now import db functions after env vars are loaded
import { initializeTables, closePool } from './src/lib/db';

async function setupDatabase() {
  console.log('Starting database setup...');
  console.log('Database Configuration:');
  console.log('  Host:', process.env.DB_HOST);
  console.log('  User:', process.env.DB_USER);
  console.log('  Database:', process.env.DB_NAME);
  console.log('  Port:', process.env.DB_PORT);
  console.log('  SSL Mode:', process.env.DB_SSL_MODE);
  console.log('');
  
  try {
    await initializeTables();
    console.log('✓ Database tables created successfully!');
    console.log('\nYou can now use the application with your Aiven MySQL database.');
  } catch (error) {
    console.error('✗ Error setting up database:', error);
    process.exit(1);
  } finally {
    await closePool();
    process.exit(0);
  }
}

setupDatabase();
