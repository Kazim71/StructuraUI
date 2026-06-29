"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Creates a new project in the Supabase 'projects' table
 * for the currently authenticated user.
 */
export async function createProject(name: string) {
  try {
    const supabase = createClient();

    // 1. Get current authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Auth error in createProject:", userError);
      return { success: false, error: "Unauthorized: User not found." };
    }

    // 2. Insert new project
    const { data, error } = await supabase
      .from("projects")
      .insert([{ name, user_id: user.id }])
      .select("id")
      .single();

    if (error) {
      console.error("Error creating project in Supabase:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { id: data.id } };
  } catch (err: any) {
    console.error("Unexpected error in createProject:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred",
    };
  }
}

/**
 * Upserts the canvas layout JSON and custom CSS into the 'layout_state' table.
 */
export async function saveLayoutState(
  projectId: string,
  canvasJson: any,
  customCss: string
) {
  try {
    const supabase = createClient();

    // Optional but recommended: Verify authentication to prevent unauthenticated server action calls
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Auth error in saveLayoutState:", userError);
      return { success: false, error: "Unauthorized: User not found." };
    }

    const { data, error } = await supabase
      .from("layout_state")
      .upsert(
        {
          project_id: projectId,
          canvas_json: canvasJson,
          custom_css: customCss,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "project_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Error saving layout state to Supabase:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Unexpected error in saveLayoutState:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred",
    };
  }
}

/**
 * Deletes a project owned by the currently authenticated user.
 */
export async function deleteProject(projectId: string) {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Auth error in deleteProject:", userError);
      return { success: false, error: "Unauthorized: User not found." };
    }

    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("user_id")
      .eq("id", projectId)
      .single();

    if (fetchError || !project) {
      return { success: false, error: "Project not found." };
    }

    if (project.user_id !== user.id) {
      return { success: false, error: "Unauthorized: You do not own this project." };
    }

    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (deleteError) {
      console.error("Error deleting project in Supabase:", deleteError);
      return { success: false, error: deleteError.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Unexpected error in deleteProject:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred",
    };
  }
}
