import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { action, facilityId, userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let result;

    if (action === 'add') {
      // Add to favorites
      const { data, error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: userId,
          facility_id: facilityId
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return new Response(
            JSON.stringify({ message: 'Facility already in favorites' }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
        throw error;
      }

      result = { message: 'Added to favorites', favorite: data };

    } else if (action === 'remove') {
      // Remove from favorites
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('facility_id', facilityId);

      if (error) throw error;

      result = { message: 'Removed from favorites' };

    } else if (action === 'list') {
      // Get user's favorites with facility details
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          created_at,
          facilities (
            id,
            name,
            facility_type,
            city,
            state,
            rating,
            price_range_min,
            price_range_max,
            accepts_medicare,
            accepts_medicaid,
            accepts_va_benefits
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      result = { favorites: data };

    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Use add, remove, or list' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Track analytics
    await supabase.from('analytics').insert({
      user_id: userId,
      event_type: 'favorite_action',
      metadata: {
        action,
        facility_id: facilityId
      }
    });

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in manage-favorites function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});