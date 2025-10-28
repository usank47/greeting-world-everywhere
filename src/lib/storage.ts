import { Order } from '@/types/order';
import { supabase } from '@/integrations/supabase/client';

// UUID validation regex
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Call MongoDB edge function
const callMongoDBFunction = async (operation: string, data?: any, orderId?: string) => {
  const { data: result, error } = await supabase.functions.invoke('mongodb-orders', {
    body: { operation, data, orderId }
  });

  if (error) {
    console.error('MongoDB function error:', error);
    throw error;
  }

  return result;
};

// Normalize text to title case
const toTitleCase = (text: string): string => {
  if (!text) return '';
  return text.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
};

export const saveOrder = async (order: Order): Promise<void> => {
  try {
    // Normalize data before saving
    const normalizedOrder = {
      ...order,
      supplier: toTitleCase(order.supplier),
      products: order.products.map(p => ({
        ...p,
        name: p.name?.trim() || '',
        category: toTitleCase(p.category),
        brand: toTitleCase(p.brand),
        compatibility: p.compatibility?.trim() || '',
      })),
    };
    
    await callMongoDBFunction('save', normalizedOrder);
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const result = await callMongoDBFunction('getAll');
    const orders = result.data || [];
    
    // Filter and normalize orders
    return orders
      .filter((order: Order) => isValidUUID(order.id))
      .filter((order: Order) => order.products.every(p => isValidUUID(p.id)))
      .map((order: Order) => ({
        ...order,
        supplier: toTitleCase(order.supplier),
        products: order.products.map(p => ({
          ...p,
          name: p.name?.trim() || '',
          category: toTitleCase(p.category),
          brand: toTitleCase(p.brand),
          compatibility: p.compatibility?.trim() || '',
          price: Number(p.price),
          quantity: Number(p.quantity),
        })),
        totalAmount: Number(order.totalAmount),
      }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    await callMongoDBFunction('delete', undefined, orderId);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

export const updateOrder = async (order: Order): Promise<void> => {
  try {
    // Normalize data before updating
    const normalizedOrder = {
      ...order,
      supplier: toTitleCase(order.supplier),
      products: order.products.map(p => ({
        ...p,
        name: p.name?.trim() || '',
        category: toTitleCase(p.category),
        brand: toTitleCase(p.brand),
        compatibility: p.compatibility?.trim() || '',
      })),
      updatedAt: new Date().toISOString(),
    };
    
    await callMongoDBFunction('update', normalizedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};
