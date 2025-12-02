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
    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Create Supabase client with user's JWT to verify their identity
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Get the calling user
    const { data: { user: callingUser }, error: userError } = await supabaseAuth.auth.getUser()
    if (userError || !callingUser) {
      console.error('Auth error:', userError)
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized - Invalid token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Create admin client for privileged operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify the calling user is an admin
    const { data: callerRole, error: roleCheckError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', callingUser.id)
      .eq('role', 'admin')
      .single()

    if (roleCheckError || !callerRole) {
      console.error('Role check error:', roleCheckError)
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden - Admin privileges required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    console.log('Admin user verified:', callingUser.email)

    const { email, password, fullName, role, department, rank, unit } = await req.json()

    // Validate required fields
    if (!email || !password || !fullName) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email, password, and full name are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)

    let userId: string

    if (existingUser) {
      // User exists, use their ID
      userId = existingUser.id
      console.log('User already exists, updating profile and role')
    } else {
      // Create user in Supabase Auth
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
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
    const { error: profileError } = await supabaseAdmin
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

    // Update or insert user role
    const { error: deleteRoleError } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', userId)

    if (deleteRoleError) {
      console.error('Delete role error:', deleteRoleError)
    }

    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role || 'user'
      })

    if (roleError) {
      console.error('Role error:', roleError)
      throw roleError
    }

    console.log('User created successfully by admin:', callingUser.email)

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: {
          id: userId,
          email: email,
          full_name: fullName,
          role: role || 'user'
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error creating user:', error)
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
