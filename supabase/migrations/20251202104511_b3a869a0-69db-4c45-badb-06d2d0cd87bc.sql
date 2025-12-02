-- Add new roles to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'analyst';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'operator';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer';