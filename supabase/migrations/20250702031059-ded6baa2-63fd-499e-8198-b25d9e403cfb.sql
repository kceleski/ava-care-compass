-- Insert sample conversation data to test the system
INSERT INTO public.ava_conversations (assistant_type) VALUES ('care_advisor');

-- Get the conversation ID and insert some sample messages
WITH new_conv AS (
  SELECT id FROM public.ava_conversations ORDER BY created_at DESC LIMIT 1
)
INSERT INTO public.ava_messages (conversation_id, role, content)
SELECT 
  new_conv.id,
  'user',
  'Hello, I''m looking for assisted living facilities in Los Angeles for my 82-year-old mother who has diabetes.'
FROM new_conv
UNION ALL
SELECT 
  new_conv.id,
  'assistant',
  'Hello! I''d be happy to help you find suitable assisted living facilities for your mother in Los Angeles. Given that she has diabetes, we''ll want to focus on facilities that provide excellent medical care and medication management. 

Based on your location preference and her medical needs, I can see we have some great options in the Los Angeles area. Can you tell me a bit more about:

1. Your budget range for monthly costs?
2. Any other specific care needs or preferences?
3. How important is it to have specialized diabetes management programs?

This will help me provide you with the most suitable recommendations!'
FROM new_conv;