-- Create incidents table for incident reporting
CREATE TABLE public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_name TEXT NOT NULL,
  incident_type TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  evidence_url TEXT,
  reported_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for incidents
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Create policies for incidents
CREATE POLICY "Anyone can create incident reports" 
ON public.incidents 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view all incidents" 
ON public.incidents 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update incidents" 
ON public.incidents 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_id = auth.uid() AND role = 'admin'::user_role
));

-- Create reports table for generated reports
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type TEXT NOT NULL,
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  crime_type TEXT NOT NULL,
  region TEXT NOT NULL,
  format TEXT NOT NULL,
  file_url TEXT,
  generated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create policies for reports
CREATE POLICY "Authenticated users can create reports" 
ON public.reports 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own reports" 
ON public.reports 
FOR SELECT 
USING (generated_by = auth.uid());

CREATE POLICY "Admins can view all reports" 
ON public.reports 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_id = auth.uid() AND role = 'admin'::user_role
));

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_incidents_updated_at
BEFORE UPDATE ON public.incidents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();