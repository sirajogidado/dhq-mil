-- Set admin@dhq.mil.ng as super user with admin role
-- First check if the user exists, if not we'll handle it in the application

-- Create a function to ensure super admin exists
CREATE OR REPLACE FUNCTION public.ensure_super_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Check if admin@dhq.mil.ng exists in auth.users
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@dhq.mil.ng';
    
    -- If user exists, ensure they have admin profile
    IF admin_user_id IS NOT NULL THEN
        -- Insert or update admin profile
        INSERT INTO public.user_profiles (
            user_id, 
            email, 
            full_name, 
            role, 
            department,
            status,
            is_active
        ) VALUES (
            admin_user_id,
            'admin@dhq.mil.ng',
            'System Administrator',
            'admin',
            'System Administration',
            'active',
            true
        )
        ON CONFLICT (user_id) 
        DO UPDATE SET
            role = 'admin',
            is_active = true,
            status = 'active';
    END IF;
END;
$$;

-- Execute the function
SELECT public.ensure_super_admin();