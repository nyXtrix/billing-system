// Client-side helper function for customers API
const API_BASE = '/api';

// Fetch all customers
export const fetchCustomers = async (search?: string) => {
  try {
    const url = search 
      ? `${API_BASE}/customers?search=${encodeURIComponent(search)}`
      : `${API_BASE}/customers`;
    
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error('Failed to fetch customers');
    }
    
    const data = await res.json();
    return data.Customers || [];
  } catch (err) {
    console.error('Error fetching customers:', err);
    return [];
  }
};
