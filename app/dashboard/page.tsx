import { createClient } from "@/lib/supabase/server";
import { createProject } from "@/app/actions/projects";
import { logout } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  async function handleCreateProject(formData: FormData) {
    "use server";
    const name = (formData.get("name") as string) || "Untitled Project";
    const result = await createProject(name);

    if (result.success && result.data?.id) {
      redirect(`/project/${result.data.id}`);
    } else {
      console.error(result.error);
    }
  }

  return (
    <DashboardShell
      userEmail={user.email || ""}
      projects={projects}
      logoutAction={logout}
      createProjectAction={handleCreateProject}
    />
  );
}
