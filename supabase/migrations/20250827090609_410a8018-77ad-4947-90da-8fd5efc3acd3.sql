-- Create admin user in auth.users manually (this will be done through the UI)
-- For now, let's create a test account that can be used immediately

-- First, let's check if we need to insert a test user into the system
-- This will create a placeholder user profile that can be activated once the auth user is created

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
    '11111111-1111-1111-1111-111111111111'::uuid,
    'admin@dhq.mil.ng',
    'System Administrator',
    'admin'::user_role,
    'Information Technology',
    'Colonel',
    '+234-800-000-0001',
    true,
    'active'
) ON CONFLICT (user_id) DO NOTHING;