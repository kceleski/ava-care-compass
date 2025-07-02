-- Create the missing facilities table since it seems the previous migration had conflicts
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

-- Add comment to identify table
COMMENT ON TABLE public.facilities IS 'ava-care-compass: Care facilities and their details';

-- Enable RLS
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY IF NOT EXISTS "Anyone can view facilities" ON public.facilities
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can create facilities" ON public.facilities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Authenticated users can update facilities" ON public.facilities
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Add trigger for timestamp updates
CREATE TRIGGER IF NOT EXISTS update_facilities_updated_at
    BEFORE UPDATE ON public.facilities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Now insert the seed data
INSERT INTO public.facilities (
  name, facility_type, address_line1, city, state, zip_code, 
  phone, email, website, description, latitude, longitude,
  capacity, current_availability, price_range_min, price_range_max,
  accepts_medicare, accepts_medicaid, accepts_va_benefits, rating, reviews_count,
  is_verified, is_featured
) VALUES 
(
  'Sunset Manor Assisted Living',
  'Assisted Living',
  '123 Oak Street',
  'Los Angeles',
  'CA',
  '90210',
  '(555) 123-4567',
  'info@sunsetmanor.com',
  'https://sunsetmanor.com',
  'A warm and welcoming assisted living community with 24/7 care, memory care services, and beautiful gardens.',
  34.0522,
  -118.2437,
  120,
  15,
  3500,
  6500,
  true,
  true,
  false,
  4.5,
  127,
  true,
  true
),
(
  'Golden Years Memory Care',
  'Memory Care',
  '456 Maple Avenue',
  'San Francisco',
  'CA',
  '94102',
  '(555) 987-6543',
  'contact@goldenyears.com',
  'https://goldenyears.com',
  'Specialized memory care facility with secure environment and expert staff trained in dementia care.',
  37.7749,
  -122.4194,
  80,
  8,
  5000,
  8500,
  true,
  true,
  true,
  4.7,
  89,
  true,
  true
),
(
  'Riverside Nursing Home',
  'Nursing Home',
  '789 River Road',
  'Sacramento',
  'CA',
  '95814',
  '(555) 456-7890',
  'admin@riverside.com',
  'https://riverside.com',
  'Full-service nursing home providing comprehensive medical care and rehabilitation services.',
  38.5816,
  -121.4944,
  200,
  25,
  4500,
  7500,
  true,
  true,
  true,
  4.2,
  203,
  true,
  false
),
(
  'Peaceful Gardens Senior Living',
  'Independent Living',
  '321 Garden Street',
  'San Diego',
  'CA',
  '92101',
  '(555) 234-5678',
  'hello@peacefulgardens.com',
  'https://peacefulgardens.com',
  'Independent living community with luxury amenities, fitness center, and social activities.',
  32.7157,
  -117.1611,
  150,
  20,
  2500,
  4500,
  false,
  false,
  false,
  4.3,
  156,
  true,
  false
),
(
  'Harmony Heights Care Center',
  'Assisted Living',
  '654 Hill Drive',
  'Fresno',
  'CA',
  '93721',
  '(555) 345-6789',
  'info@harmonyheights.com',
  'https://harmonyheights.com',
  'Family-owned assisted living facility with personalized care plans and home-like atmosphere.',
  36.7378,
  -119.7871,
  90,
  12,
  3200,
  5800,
  true,
  true,
  false,
  4.4,
  92,
  true,
  false
),
(
  'Oceanview Senior Community',
  'Continuing Care',
  '987 Coastal Highway',
  'Monterey',
  'CA',
  '93940',
  '(555) 567-8901',
  'contact@oceanview.com',
  'https://oceanview.com',
  'Luxury continuing care retirement community with ocean views and resort-style amenities.',
  36.6002,
  -121.8947,
  250,
  18,
  6000,
  12000,
  true,
  false,
  true,
  4.8,
  341,
  true,
  true
);