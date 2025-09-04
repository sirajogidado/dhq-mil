-- Add profile picture URL column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN profile_picture_url TEXT;