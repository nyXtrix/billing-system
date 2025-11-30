import { useState, useEffect } from 'react';
import { fetchProducts } from '@/app/api/products/client';
import { fetchCustomers } from '@/app/api/customers/client';

export function useProductsAndCustomers() {
  const [products, setProducts] = useState<string[]>([]);
  const [customers, setCustomers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, customersData] = await Promise.all([
          fetchProducts(),
          fetchCustomers(),
        ]);

        // Extract product names
        const productNames = productsData.map((p: any) => p.ProductName);
        setProducts(productNames);

        // Extract customer names
        const customerNames = customersData.map((c: any) => c.CustomerName);
        setCustomers(customerNames);
      } catch (error) {
        console.error('Error loading products and customers:', error);
        console.log('Database not available - using empty arrays');
        // Fallback to empty arrays if database is not available
        setProducts([]);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { products, customers, loading };
}
