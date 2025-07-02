import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchParams {
  location?: string;
  facilityType?: string;
  priceMin?: number;
  priceMax?: number;
  acceptsMedicare?: boolean;
  acceptsMedicaid?: boolean;
  acceptsVA?: boolean;
  radius?: number; // in miles
  lat?: number;
  lng?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { searchParams }: { searchParams: SearchParams } = await req.json();
    
    // Log search request for analytics
    const userId = req.headers.get('user-id');
    if (userId) {
      await supabase.from('search_requests').insert({
        user_id: userId,
        query_params: searchParams
      });
    }

    // Build dynamic query
    let query = supabase
      .from('facilities')
      .select('*')
      .eq('is_verified', true);

    // Apply filters
    if (searchParams.facilityType) {
      query = query.eq('facility_type', searchParams.facilityType);
    }

    if (searchParams.priceMin !== undefined) {
      query = query.gte('price_range_min', searchParams.priceMin);
    }

    if (searchParams.priceMax !== undefined) {
      query = query.lte('price_range_max', searchParams.priceMax);
    }

    if (searchParams.acceptsMedicare) {
      query = query.eq('accepts_medicare', true);
    }

    if (searchParams.acceptsMedicaid) {
      query = query.eq('accepts_medicaid', true);
    }

    if (searchParams.acceptsVA) {
      query = query.eq('accepts_va_benefits', true);
    }

    if (searchParams.location) {
      query = query.ilike('city', `%${searchParams.location}%`);
    }

    // Execute query
    const { data: facilities, error } = await query
      .order('rating', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Filter by radius if coordinates provided
    let filteredFacilities = facilities || [];
    if (searchParams.lat && searchParams.lng && searchParams.radius) {
      filteredFacilities = filteredFacilities.filter(facility => {
        if (!facility.latitude || !facility.longitude) return false;
        
        const distance = calculateDistance(
          searchParams.lat!,
          searchParams.lng!,
          facility.latitude,
          facility.longitude
        );
        
        return distance <= (searchParams.radius || 25);
      });
    }

    // Update search request with results count
    if (userId) {
      await supabase
        .from('search_requests')
        .update({ results_count: filteredFacilities.length })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
    }

    // Track analytics
    await supabase.from('analytics').insert({
      user_id: userId,
      event_type: 'facility_search',
      metadata: {
        ...searchParams,
        results_count: filteredFacilities.length
      }
    });

    return new Response(
      JSON.stringify({ 
        facilities: filteredFacilities,
        total: filteredFacilities.length 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in search-facilities function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}