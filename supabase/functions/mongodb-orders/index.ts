import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MONGODB_URI = Deno.env.get('MONGODB_URI');
const MONGODB_API_KEY = Deno.env.get('MONGODB_API_KEY');
const MONGODB_DATA_API_URL = Deno.env.get('MONGODB_DATA_API_URL');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { operation, data, orderId } = await req.json();
    console.log('MongoDB operation:', operation, 'orderId:', orderId);

    if (!MONGODB_DATA_API_URL || !MONGODB_API_KEY) {
      throw new Error('MongoDB Data API credentials not configured');
    }

    const apiEndpoint = `${MONGODB_DATA_API_URL}/action`;
    const headers = {
      'Content-Type': 'application/json',
      'api-key': MONGODB_API_KEY,
    };

    let result;

    switch (operation) {
      case 'save':
        // Upsert order (insert or replace)
        const saveResponse = await fetch(`${apiEndpoint}/replaceOne`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            dataSource: 'Cluster0',
            database: 'orderflow',
            collection: 'orders',
            filter: { id: data.id },
            replacement: data,
            upsert: true,
          }),
        });
        result = await saveResponse.json();
        console.log('Save result:', result);
        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'getAll':
        // Find all orders
        const getAllResponse = await fetch(`${apiEndpoint}/find`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            dataSource: 'Cluster0',
            database: 'orderflow',
            collection: 'orders',
            filter: {},
          }),
        });
        const getAllResult = await getAllResponse.json();
        const orders = getAllResult.documents || [];
        console.log('Found orders:', orders.length);
        return new Response(
          JSON.stringify({ success: true, data: orders }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'delete':
        // Delete order
        const deleteResponse = await fetch(`${apiEndpoint}/deleteOne`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            dataSource: 'Cluster0',
            database: 'orderflow',
            collection: 'orders',
            filter: { id: orderId },
          }),
        });
        result = await deleteResponse.json();
        console.log('Delete result:', result);
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'update':
        // Update order
        const updateResponse = await fetch(`${apiEndpoint}/replaceOne`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            dataSource: 'Cluster0',
            database: 'orderflow',
            collection: 'orders',
            filter: { id: data.id },
            replacement: data,
          }),
        });
        result = await updateResponse.json();
        console.log('Update result:', result);
        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  } catch (error) {
    console.error('Error in mongodb-orders function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
