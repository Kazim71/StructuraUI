import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();

  const email = "admin@structuraui.com";
  const password = "AdminPassword123!";

  try {
    // 1. Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      );
    }

    const userId = authData.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID not returned after signup." },
        { status: 500 }
      );
    }

    // 2. Upsert the profile to make them an admin and Pro
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          role: "admin",
          is_pro: true,
          generations_count: 0,
        },
        { onConflict: "id" }
      );

    if (profileError) {
      return NextResponse.json(
        { success: false, error: profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      email,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
