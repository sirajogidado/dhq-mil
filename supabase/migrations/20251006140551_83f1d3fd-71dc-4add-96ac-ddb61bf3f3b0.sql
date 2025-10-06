-- Fix infinite recursion in user_profiles RLS policies
-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

-- Recreate it using the security definer function to avoid recursion
CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Also ensure other policies use the security definer function
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;

CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));