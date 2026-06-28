import { createClient } from "@/lib/supabase/server";
import { createProject } from "@/app/actions/projects";
import { logout } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import Link from "next/link";

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

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
      userRole={profile?.role}
      logoutAction={logout}
      createProjectAction={handleCreateProject}
    >
      {!projects || projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f1efe6] dark:bg-[#322f28] border border-[#c7bd9b] dark:border-[#4a4940]">
            <svg className="h-10 w-10 text-[#58554e]/40 dark:text-[#b8b4a8]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#3f403c] dark:text-[#e8e6df] mb-2">No projects yet</h2>
          <p className="text-sm text-[#58554e] dark:text-[#b8b4a8] max-w-sm mb-6">
            Create your first project using the &ldquo;New Project&rdquo; button above to start building beautiful, structured web layouts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col rounded-xl border border-[#c7bd9b] dark:border-[#4a4940] bg-white dark:bg-[#322f28] overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#809bce]"
            >
              {/* Preview Area */}
              <div className="relative h-40 bg-[#f1efe6] dark:bg-[#26251f] flex items-center justify-center border-b border-[#c7bd9b]/50 dark:border-[#4a4940]/50">
                <div className="flex flex-col items-center gap-2 opacity-40 group-hover:opacity-60 transition-opacity">
                  <svg className="h-10 w-10 text-[#58554e] dark:text-[#b8b4a8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
                  </svg>
                  <span className="text-xs font-bold text-[#58554e] dark:text-[#b8b4a8]">Layout Preview</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3.5 flex items-center justify-between">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#3f403c] dark:text-[#e8e6df] truncate">
                    {project.name}
                  </h3>
                  <p className="text-xs text-[#58554e]/70 dark:text-[#b8b4a8]/70 mt-0.5">
                    {new Date(project.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Link href={`/project/${project.id}`} className="shrink-0">
                  <button className="px-3 py-1.5 text-xs font-bold text-[#3f403c] dark:text-[#26251f] bg-[#e0dac9] dark:bg-[#b8b4a8] rounded-md hover:bg-[#c7bd9b] dark:hover:bg-[#e8e6df] transition-colors">
                    Open Editor
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
