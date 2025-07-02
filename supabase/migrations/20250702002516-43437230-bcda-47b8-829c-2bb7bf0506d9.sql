-- Create essential tables for ava-care-compass project
-- User profiles table for additional user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Facilities table for care facilities
CREATE TABLE IF NOT EXISTS public.facilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  facility_type TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  description TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  capacity INTEGER,
  current_availability INTEGER,
  price_range_min NUMERIC,
  price_range_max NUMERIC,
  accepts_medicare BOOLEAN DEFAULT false,
  accepts_medicaid BOOLEAN DEFAULT false,
  accepts_va_benefits BOOLEAN DEFAULT false,
  rating NUMERIC,
  reviews_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Seniors table for care recipients
CREATE TABLE IF NOT EXISTS public.seniors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  preferred_location TEXT,
  budget_min NUMERIC,
  budget_max NUMERIC,
  medical_needs TEXT[],
  additional_preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Search requests table
CREATE TABLE IF NOT EXISTS public.search_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  query_params JSONB NOT NULL,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT search_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- User favorites table
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  facility_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT user_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT user_favorites_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(id) ON DELETE CASCADE,
  UNIQUE(user_id, facility_id)
);

-- Conversations table for ava chat
CREATE TABLE IF NOT EXISTS public.ava_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  assistant_type TEXT DEFAULT 'care_advisor',
  openai_thread_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT ava_conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Messages table for ava chat
CREATE TABLE IF NOT EXISTS public.ava_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT ava_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.ava_conversations(id) ON DELETE CASCADE
);

-- Analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  event_type TEXT,
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT analytics_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Add metadata description to identify this as ava-care-compass project
COMMENT ON SCHEMA public IS 'ava-care-compass: Senior care facility search and advisor platform';
COMMENT ON TABLE public.profiles IS 'ava-care-compass: User profile information';
COMMENT ON TABLE public.facilities IS 'ava-care-compass: Care facilities and their details';
COMMENT ON TABLE public.seniors IS 'ava-care-compass: Senior care recipients';
COMMENT ON TABLE public.search_requests IS 'ava-care-compass: User search history and preferences';
COMMENT ON TABLE public.user_favorites IS 'ava-care-compass: User favorite facilities';
COMMENT ON TABLE public.ava_conversations IS 'ava-care-compass: AI assistant conversations';
COMMENT ON TABLE public.ava_messages IS 'ava-care-compass: AI assistant messages';
COMMENT ON TABLE public.analytics IS 'ava-care-compass: User analytics and tracking';

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seniors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ava_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ava_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for facilities (public read, authenticated write)
CREATE POLICY "Anyone can view facilities" ON public.facilities
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create facilities" ON public.facilities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update facilities" ON public.facilities
  FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for seniors
CREATE POLICY "Users can view seniors they created" ON public.seniors
  FOR SELECT USING (true); -- Public for now, can be restricted later

CREATE POLICY "Anyone can create senior profiles" ON public.seniors
  FOR INSERT WITH CHECK (true);

-- RLS Policies for search_requests
CREATE POLICY "Users can view their own search requests" ON public.search_requests
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create search requests" ON public.search_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for user_favorites
CREATE POLICY "Users can view their own favorites" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" ON public.user_favorites
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for ava_conversations
CREATE POLICY "Users can view their own conversations" ON public.ava_conversations
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create conversations" ON public.ava_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own conversations" ON public.ava_conversations
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for ava_messages
CREATE POLICY "Users can view messages from their conversations" ON public.ava_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ava_conversations 
      WHERE ava_conversations.id = ava_messages.conversation_id 
      AND (ava_conversations.user_id = auth.uid() OR ava_conversations.user_id IS NULL)
    )
  );

CREATE POLICY "Users can create messages in their conversations" ON public.ava_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ava_conversations 
      WHERE ava_conversations.id = ava_messages.conversation_id 
      AND (ava_conversations.user_id = auth.uid() OR ava_conversations.user_id IS NULL)
    )
  );

-- RLS Policies for analytics
CREATE POLICY "Users can view their own analytics" ON public.analytics
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can insert analytics" ON public.analytics
  FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_facilities_updated_at
    BEFORE UPDATE ON public.facilities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seniors_updated_at
    BEFORE UPDATE ON public.seniors
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ava_conversations_updated_at
    BEFORE UPDATE ON public.ava_conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();