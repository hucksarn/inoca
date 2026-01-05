import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const body = await req.json().catch(() => ({}));
    const action = body.action;

    // Handle reset action - delete existing admin and recreate
    if (action === "reset") {
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const adminUser = existingUsers?.users?.find(u => u.email === "admin@system.local");
      if (adminUser) {
        await supabase.auth.admin.deleteUser(adminUser.id);
        console.log("Deleted existing admin user");
      }
    } else {
      // Check if admin already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const adminExists = existingUsers?.users?.some(u => u.email === "admin@system.local");
      if (adminExists) {
        return new Response(
          JSON.stringify({ error: "Admin user already exists" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Create admin user
    const { data: user, error: createError } = await supabase.auth.admin.createUser({
      email: "admin@system.local",
      password: "admin123",
      email_confirm: true,
      user_metadata: {
        full_name: "System Admin",
        designation: "System Admin",
        role: "admin",
        must_change_password: true,
      },
    });

    if (createError) {
      throw createError;
    }

    return new Response(
      JSON.stringify({ 
        message: "Admin created successfully", 
        email: "admin@system.local",
        note: "Password: admin123 - User must change password on first login"
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error creating admin:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
