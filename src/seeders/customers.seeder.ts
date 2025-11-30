import { query } from '../lib/db';

export async function seedCustomers() {
  console.log('Seeding customers...');
  
  const customers = [
    { name: 'AATREYA EXPORT', mobile: '9876543210', address: 'Chennai, Tamil Nadu' },
    { name: 'ABARNA EXPORTS', mobile: '9876543211', address: 'Coimbatore, Tamil Nadu' },
    { name: 'FABRIC SOLUTIONS INC', mobile: '9876543212', address: 'Bangalore, Karnataka' },
    { name: 'A.K.R GARMENTS', mobile: '9876543213', address: 'Tirupur, Tamil Nadu' },
    { name: 'TEXTILE TRADERS', mobile: '9876543214', address: 'Mumbai, Maharashtra' },
    { name: 'GLOBAL PACKAGING', mobile: '9876543215', address: 'Delhi, NCR' },
    { name: 'MODERN PLASTICS', mobile: '9876543216', address: 'Pune, Maharashtra' },
    { name: 'SUPREME EXPORTS', mobile: '9876543217', address: 'Hyderabad, Telangana' },
  ];

  for (const customer of customers) {
    try {
      await query(
        'INSERT INTO customers (CustomerName, MobileNo, Address) VALUES (?, ?, ?)',
        [customer.name, customer.mobile, customer.address]
      );
    } catch (error) {
      console.error(`Error inserting customer ${customer.name}:`, error);
    }
  }

  console.log(`✓ Seeded ${customers.length} customers`);
}
