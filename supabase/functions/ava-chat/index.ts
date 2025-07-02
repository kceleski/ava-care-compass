import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    const { message, conversationId, userId } = await req.json();

    let conversation_id = conversationId;

    // Create new conversation if none exists
    if (!conversation_id) {
      const { data: newConversation, error: convError } = await supabase
        .from('ava_conversations')
        .insert({
          user_id: userId,
          assistant_type: 'care_advisor'
        })
        .select()
        .single();

      if (convError) throw convError;
      conversation_id = newConversation.id;
    }

    // Save user message
    await supabase.from('ava_messages').insert({
      conversation_id,
      role: 'user',
      content: message
    });

    // Get conversation history
    const { data: messages } = await supabase
      .from('ava_messages')
      .select('role, content')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true });

    // Prepare OpenAI messages
    const openAIMessages = [
      {
        role: 'system',
        content: `You are Ava, a knowledgeable and empathetic senior care advisor. You help families find the right care facilities for their loved ones. You can:

1. Ask clarifying questions about care needs, budget, location preferences
2. Provide information about different types of senior care (assisted living, memory care, nursing homes, etc.)
3. Explain what to look for when choosing a facility
4. Offer emotional support during this difficult decision process
5. Suggest questions to ask when touring facilities

Be warm, professional, and understanding. Focus on the specific needs of each family. If asked about specific facilities, remind users to use the search function to find verified facilities in their area.`
      },
      ...messages?.map(msg => ({
        role: msg.role,
        content: msg.content
      })) || []
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: openAIMessages,
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    const aiResponse = await response.json();
    const assistantMessage = aiResponse.choices[0].message.content;

    // Save assistant message
    await supabase.from('ava_messages').insert({
      conversation_id,
      role: 'assistant',
      content: assistantMessage
    });

    // Track analytics
    await supabase.from('analytics').insert({
      user_id: userId,
      event_type: 'ava_chat_interaction',
      metadata: {
        conversation_id,
        message_length: message.length,
        response_length: assistantMessage.length
      }
    });

    return new Response(
      JSON.stringify({ 
        message: assistantMessage,
        conversationId: conversation_id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in ava-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});