-- Create missing tables for care planning tools

-- Care type definitions (separate from existing care_types)
CREATE TABLE public.care_type_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  base_hourly_rate DECIMAL(8,2) NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Location-based cost multipliers
CREATE TABLE public.location_multipliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  cost_multiplier DECIMAL(4,2) NOT NULL DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Additional care services
CREATE TABLE public.care_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  additional_cost DECIMAL(6,2) NOT NULL,
  care_type_id UUID REFERENCES public.care_type_definitions(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User emergency contacts
CREATE TABLE public.user_emergency_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Emergency hotlines and services
CREATE TABLE public.emergency_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  contact_type TEXT NOT NULL,
  description TEXT,
  available_24_7 BOOLEAN DEFAULT false,
  location_specific TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Care needs assessments
CREATE TABLE public.care_needs_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  current_mobility TEXT,
  cognitive_status TEXT,
  medical_conditions TEXT,
  support_system TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Timeline milestones templates
CREATE TABLE public.timeline_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  estimated_timeframe TEXT,
  care_level_required TEXT,
  task_template TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User timeline plans
CREATE TABLE public.timeline_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.care_needs_assessments(id),
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Plan milestones (user-specific instances)
CREATE TABLE public.plan_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timeline_plan_id UUID REFERENCES public.timeline_plans(id),
  milestone_id UUID REFERENCES public.timeline_milestones(id),
  estimated_date DATE,
  tasks TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.care_type_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_multipliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_needs_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Care type definitions are viewable by everyone" ON public.care_type_definitions FOR SELECT USING (true);
CREATE POLICY "Location multipliers are viewable by everyone" ON public.location_multipliers FOR SELECT USING (true);
CREATE POLICY "Care services are viewable by everyone" ON public.care_services FOR SELECT USING (true);
CREATE POLICY "Users can manage their own emergency contacts" ON public.user_emergency_contacts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Emergency contacts are viewable by everyone" ON public.emergency_contacts FOR SELECT USING (true);
CREATE POLICY "Users can manage their own assessments" ON public.care_needs_assessments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Timeline milestones are viewable by everyone" ON public.timeline_milestones FOR SELECT USING (true);
CREATE POLICY "Users can manage their own timeline plans" ON public.timeline_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own plan milestones" ON public.plan_milestones FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.timeline_plans 
  WHERE timeline_plans.id = plan_milestones.timeline_plan_id 
  AND timeline_plans.user_id = auth.uid()
));

-- Add triggers for updated_at
CREATE TRIGGER update_care_type_definitions_updated_at
  BEFORE UPDATE ON public.care_type_definitions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_emergency_contacts_updated_at
  BEFORE UPDATE ON public.user_emergency_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_timeline_plans_updated_at
  BEFORE UPDATE ON public.timeline_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plan_milestones_updated_at
  BEFORE UPDATE ON public.plan_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert seed data
INSERT INTO public.care_type_definitions (name, description, base_hourly_rate, category) VALUES
('Home Care', 'Personal care services provided in your home', 25.00, 'home'),
('Assisted Living', 'Residential care with assistance for daily activities', 35.00, 'residential'),
('Memory Care', 'Specialized care for dementia and Alzheimer''s', 45.00, 'specialized'),
('Nursing Home', 'Skilled nursing care and medical supervision', 40.00, 'medical'),
('Adult Day Care', 'Daytime care and activities for seniors', 15.00, 'community');

INSERT INTO public.location_multipliers (state, city, cost_multiplier) VALUES
('CA', 'Los Angeles', 1.3),
('CA', 'San Francisco', 1.5),
('CA', 'San Diego', 1.2),
('CA', 'Sacramento', 1.1),
('TX', 'Dallas', 1.0),
('TX', 'Houston', 1.1),
('NY', 'New York', 1.6),
('FL', 'Miami', 1.2);

INSERT INTO public.emergency_contacts (name, phone, contact_type, description, available_24_7) VALUES
('National Suicide Prevention Lifeline', '988', 'mental_health', 'Crisis counseling and suicide prevention', true),
('Eldercare Locator', '1-800-677-1116', 'general', 'Connects you to local area agencies on aging', true),
('Adult Protective Services', '1-800-677-1116', 'general', 'Reports of elder abuse, neglect, or exploitation', true),
('Alzheimer''s Association Helpline', '1-800-272-3900', 'medical', '24/7 support for dementia-related questions', true),
('Area Agency on Aging', '211', 'local_service', 'Local aging services and resources', false);

INSERT INTO public.timeline_milestones (name, description, estimated_timeframe, care_level_required, task_template) VALUES
('Home Safety Assessment', 'Evaluate and modify the home for safety', 'Within 1 month', 'independent', 'Install grab bars\nRemove trip hazards\nImprove lighting\nInstall stair railings'),
('Legal Planning', 'Complete essential legal documents', 'Within 2 months', 'independent', 'Create power of attorney\nDraft advance directives\nUpdate will\nOrganize important documents'),
('Healthcare Team Setup', 'Establish relationships with healthcare providers', 'Within 3 months', 'any', 'Find geriatrician\nSchedule comprehensive physical\nOrganize medication review\nSet up pharmacy delivery'),
('Financial Planning', 'Review and organize financial resources', 'Within 2 months', 'independent', 'Review insurance coverage\nExplore long-term care insurance\nOrganize financial documents\nCreate budget for care expenses'),
('Care Options Research', 'Explore available care options', 'Within 6 months', 'assisted', 'Tour assisted living facilities\nInterview home care agencies\nResearch adult day programs\nGet cost estimates'),
('Family Communication', 'Discuss care preferences with family', 'Within 1 month', 'any', 'Schedule family meeting\nDiscuss care preferences\nDefine roles and responsibilities\nCreate emergency contact list');