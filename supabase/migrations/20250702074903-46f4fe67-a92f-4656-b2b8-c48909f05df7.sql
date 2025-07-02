-- Create table for SerperAPI search results
CREATE TABLE public.serperapi_search_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  search_query TEXT NOT NULL,
  search_parameters JSONB,
  raw_response JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for parsed places from SerperAPI
CREATE TABLE public.serperapi_places (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_result_id UUID REFERENCES public.serperapi_search_results(id) ON DELETE CASCADE,
  position INTEGER,
  external_uuid TEXT,
  title TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  rating DECIMAL(3,2),
  rating_count INTEGER,
  place_type TEXT,
  place_types JSONB,
  website TEXT,
  phone_number TEXT,
  opening_hours JSONB,
  thumbnail_url TEXT,
  cid TEXT,
  fid TEXT,
  place_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for AI conversation summaries
CREATE TABLE public.search_conversation_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_result_id UUID REFERENCES public.serperapi_search_results(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  markup_content TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.serperapi_search_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.serperapi_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_conversation_summaries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own search results" 
ON public.serperapi_search_results 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view places from their searches" 
ON public.serperapi_places 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.serperapi_search_results 
  WHERE serperapi_search_results.id = serperapi_places.search_result_id 
  AND serperapi_search_results.user_id = auth.uid()
));

CREATE POLICY "Users can manage their own conversation summaries" 
ON public.search_conversation_summaries 
FOR ALL 
USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX idx_serperapi_places_search_result_id ON public.serperapi_places(search_result_id);
CREATE INDEX idx_serperapi_places_location ON public.serperapi_places(latitude, longitude);
CREATE INDEX idx_search_conversation_summaries_search_result_id ON public.search_conversation_summaries(search_result_id);