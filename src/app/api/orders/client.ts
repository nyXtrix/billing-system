// Client-side helper functions for orders API
const API_BASE = '/api';

// Fetch order by order number
export const fetchOrder = async (orderNo: string | number) => {
  console.log(`Fetching order ${orderNo} from local database...`);
  
  try {
    const res = await fetch(`${API_BASE}/orders?orderNo=${orderNo}`);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch order: ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('Fetched order:', data);
    return data;
  } catch (err) {
    console.error('Error fetching order:', err);
    throw err;
  }
};

// Save or update order
export const saveOrder = async (orderData: any, isUpdate: boolean = false) => {
  console.log(`${isUpdate ? 'Updating' : 'Creating'} order...`);
  console.log('Order data:', orderData);
  
  try {
    const method = isUpdate ? 'PUT' : 'POST';
    const res = await fetch(`${API_BASE}/orders`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.Message || `Failed to ${isUpdate ? 'update' : 'create'} order`);
    }
    
    const result = await res.json();
    console.log(`${isUpdate ? 'Update' : 'Create'} result:`, result);
    return result;
  } catch (err) {
    console.error(`Error ${isUpdate ? 'updating' : 'creating'} order:`, err);
    throw err;
  }
};

// Fetch all orders
export const fetchAllOrders = async () => {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch orders');
    }
    
    const data = await res.json();
    return data.Orders || [];
  } catch (err) {
    console.error('Error fetching orders:', err);
    return [];
  }
};
