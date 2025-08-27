-- Insert initial admin user profile
-- First we need to insert into auth.users (this will be handled by Supabase Auth)
-- We'll create a user profile for the admin

INSERT INTO public.user_profiles (
    user_id,
    email,
    full_name,
    role,
    department,
    rank,
    phone_number,
    is_active,
    status
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'admin@dhq.mil.ng',
    'System Administrator',
    'admin'::user_role,
    'Information Technology',
    'Major',
    '+234-800-000-0001',
    true,
    'active'
);

-- Create a function to handle user registration approval
CREATE OR REPLACE FUNCTION approve_user_registration(registration_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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