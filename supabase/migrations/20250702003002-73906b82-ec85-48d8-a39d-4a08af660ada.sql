-- Create facilities table for ava-care-compass project
CREATE TABLE public.facilities (
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

-- Add comment
COMMENT ON TABLE public.facilities IS 'ava-care-compass: Care facilities and their details';

-- Enable RLS
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "facilities_select_policy" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "facilities_insert_policy" ON public.facilities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "facilities_update_policy" ON public.facilities FOR UPDATE USING (auth.role() = 'authenticated');

-- Add trigger
CREATE TRIGGER update_facilities_updated_at
    BEFORE UPDATE ON public.facilities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();