import { Order } from '@/types/order';
import { supabase } from '@/integrations/supabase/client';

// Normalize text to title case
const toTitleCase = (text: string): string => {
  if (!text) return '';
  return text.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
};

export const saveOrder = async (order: Order): Promise<void> => {
  try {
    // Normalize data before saving
    const normalizedOrder = {
      id: order.id,
      date: order.date,
      supplier: toTitleCase(order.supplier),
      total_amount: order.totalAmount,
    };
    
    // Insert order
    const { error: orderError } = await supabase
      .from('orders')
      .insert(normalizedOrder);
    
    if (orderError) throw orderError;
    
    // Insert products
    const normalizedProducts = order.products.map(p => ({
      id: p.id,
      order_id: order.id,
      name: p.name?.trim() || '',
      category: toTitleCase(p.category),
      brand: toTitleCase(p.brand),
      compatibility: p.compatibility?.trim() || '',
      quantity: p.quantity,
      price: p.price,
    }));
    
    const { error: productsError } = await supabase
      .from('order_products')
      .insert(normalizedProducts);
    
    if (productsError) throw productsError;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    // Fetch all orders
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (ordersError) throw ordersError;
    if (!ordersData) return [];
    
    // Fetch all products
    const { data: productsData, error: productsError } = await supabase
      .from('order_products')
      .select('*');
    
    if (productsError) throw productsError;
    
    // Map orders with their products
    return ordersData.map(order => ({
      id: order.id,
      date: order.date,
      supplier: toTitleCase(order.supplier),
      totalAmount: Number(order.total_amount),
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      products: (productsData || [])
        .filter(p => p.order_id === order.id)
        .map(p => ({
          id: p.id,
          name: p.name?.trim() || '',
          category: toTitleCase(p.category),
          brand: toTitleCase(p.brand),
          compatibility: p.compatibility?.trim() || '',
          price: Number(p.price),
          quantity: Number(p.quantity),
        })),
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    // Delete products first (foreign key dependency)
    const { error: productsError } = await supabase
      .from('order_products')
      .delete()
      .eq('order_id', orderId);
    
    if (productsError) throw productsError;
    
    // Delete order
    const { error: orderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);
    
    if (orderError) throw orderError;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

export const updateOrder = async (order: Order): Promise<void> => {
  try {
    // Update order
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        date: order.date,
        supplier: toTitleCase(order.supplier),
        total_amount: order.totalAmount,
      })
      .eq('id', order.id);
    
    if (orderError) throw orderError;
    
    // Delete existing products
    const { error: deleteError } = await supabase
      .from('order_products')
      .delete()
      .eq('order_id', order.id);
    
    if (deleteError) throw deleteError;
    
    // Insert updated products
    const normalizedProducts = order.products.map(p => ({
      id: p.id,
      order_id: order.id,
      name: p.name?.trim() || '',
      category: toTitleCase(p.category),
      brand: toTitleCase(p.brand),
      compatibility: p.compatibility?.trim() || '',
      quantity: p.quantity,
      price: p.price,
    }));
    
    const { error: productsError } = await supabase
      .from('order_products')
      .insert(normalizedProducts);
    
    if (productsError) throw productsError;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};
