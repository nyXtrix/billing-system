// Client-side helper function for products API
const API_BASE = '/api';

// Fetch all products
export const fetchProducts = async (search?: string) => {
  try {
    const url = search 
      ? `${API_BASE}/products?search=${encodeURIComponent(search)}`
      : `${API_BASE}/products`;
    
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await res.json();
    return data.Products || [];
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
};
