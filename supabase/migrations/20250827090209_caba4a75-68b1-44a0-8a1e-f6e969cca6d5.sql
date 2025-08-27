-- Fix security issues by setting search_path for all functions

-- Fix get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
    SELECT role FROM public.user_profiles WHERE user_id = user_uuid;
$function$;

-- Fix has_role function  
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
    SELECT EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_id = _user_id AND role = _role AND is_active = true
    );
$function$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Fix generate_registration_id function
CREATE OR REPLACE FUNCTION public.generate_registration_id()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    RETURN 'NG-' || to_char(NOW(), 'YYYY') || '-' || LPAD(floor(random() * 999999)::TEXT, 6, '0');
END;
$function$;

-- Fix approve_user_registration function
CREATE OR REPLACE FUNCTION approve_user_registration(registration_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    reg_record RECORD;
BEGIN
    -- Get the registration record
    SELECT * INTO reg_record 
    FROM pending_registrations 
    WHERE id = registration_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Registration not found';
    END IF;
    
    -- Update the registration status
    UPDATE pending_registrations 
    SET 
        status = 'approved',
        approved_by = auth.uid(),
        approved_at = now()
    WHERE id = registration_id;
    
    -- Note: The actual user creation will be handled by the application
    -- after the admin approves the registration
END;
$$;