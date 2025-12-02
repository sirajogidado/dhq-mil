import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, fullName, role, department, rank, unit } = await req.json()

    // Create a Supabase client with the service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)

    let userId: string

    if (existingUser) {
      // User exists, use their ID
      userId = existingUser.id
      console.log('User already exists, updating profile and role')
    } else {
      // Create user in Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { full_name: fullName }
      })

      if (authError) {
        throw authError
      }

      if (!authUser.user) {
        throw new Error('Failed to create user')
      }

      userId = authUser.user.id
      console.log('Created new user:', userId)
    }

    // Wait a moment for the trigger to complete
    await new Promise(resolve => setTimeout(resolve, 500))

    // Update user profile with additional details
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        email: email,
        full_name: fullName,
        department: department,
        rank: rank,
        unit: unit,
        is_active: true
      }, { onConflict: 'user_id' })

    if (profileError) {
      console.error('Profile error:', profileError)
    }

    // Update or insert user role to admin
    const { error: deleteRoleError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)

    if (deleteRoleError) {
      console.error('Delete role error:', deleteRoleError)
    }

    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role || 'admin'
      })

    if (roleError) {
      console.error('Role error:', roleError)
      throw roleError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: {
          id: userId,
          email: email,
          full_name: fullName,
          role: role || 'admin'
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error creating admin user:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})