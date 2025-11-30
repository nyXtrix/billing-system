import { query } from '../lib/db';

export async function seedProducts() {
  console.log('Seeding products...');
  
  const products = [
    { name: '1 KG PET BOX', description: 'PET box for 1 kg packaging' },
    { name: '1/4 KG PET BOX', description: 'PET box for 1/4 kg packaging' },
    { name: '2C PRINTED POLYBAG', description: '2 color printed polybag' },
    { name: '3 COLOUR PRINTED BAG', description: '3 color printed bag' },
    { name: '4 COLOUR PRINTED BAG', description: '4 color printed bag' },
    { name: 'BLACK LDPE POLYBAG', description: 'Black LDPE polybag' },
    { name: 'AUSTRALIAN MANS POLY SHEET', description: 'Australian mans poly sheet' },
    { name: 'TRANSPARENT POLYBAG', description: 'Transparent polybag' },
    { name: 'ZIPPER POUCH', description: 'Zipper pouch for packaging' },
    { name: 'STAND UP POUCH', description: 'Stand up pouch' },
  ];

  for (const product of products) {
    try {
      await query(
        'INSERT INTO products (ProductName, Description) VALUES (?, ?) ON DUPLICATE KEY UPDATE Description = ?',
        [product.name, product.description, product.description]
      );
    } catch (error) {
      console.error(`Error inserting product ${product.name}:`, error);
    }
  }

  console.log(`✓ Seeded ${products.length} products`);
}
