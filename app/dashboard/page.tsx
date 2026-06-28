import { createClient } from "@/lib/supabase/server";
import { createProject } from "@/app/actions/projects";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import Logo from "@/components/Logo";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: projects, error } = await supabase
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
    <div className="min-h-screen bg-[#f8f7f3] text-[#3f403c] font-sans">
      {/* Header */}
      <header className="bg-[#e0dac9] shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight text-[#3f403c]">StructuraUI Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#58554e] hidden sm:block">{user.email}</span>
            <form action={logout}>
              <button className="text-sm font-bold text-[#58554e] hover:text-[#3f403c] transition-colors">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 lg:p-8 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-[#e3decd] pb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#3f403c]">Your Workspaces</h1>
            <p className="text-[#58554e] mt-1">Manage and edit your structural layouts.</p>
          </div>
          <form action={handleCreateProject} className="flex gap-2">
            <input
              name="name"
              placeholder="Project Name"
              className="rounded-sm border border-[#c7bd9b] bg-white px-4 py-2 text-sm text-[#3f403c] placeholder-[#a8a497] focus:border-[#58554e] focus:outline-none focus:ring-1 focus:ring-[#58554e]"
              required
            />
            <button
              type="submit"
              className="rounded-sm bg-[#3f403c] px-6 py-2 text-sm font-bold text-white hover:bg-[#58554e] transition-colors shadow-sm"
            >
              Create Project
            </button>
          </form>
        </div>

        {error ? (
          <div className="text-red-600 bg-red-50 p-4 rounded-sm border border-red-200">
            Error loading projects: {error.message}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects?.length === 0 ? (
              <div className="col-span-full rounded-sm border-2 border-dashed border-[#c7bd9b] bg-[#f1efe6] p-16 text-center text-[#58554e]">
                <p className="text-lg font-medium mb-2">No projects found</p>
                <p className="text-sm">Create a new project to start designing your next web experience.</p>
              </div>
            ) : (
              projects?.map((project) => (
                <Link
                  key={project.id}
                  href={`/project/${project.id}`}
                  className="group relative flex flex-col justify-between rounded-sm bg-[#e3decd] p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md border border-transparent hover:border-[#c7bd9b]"
                >
                  <div>
                    <h3 className="text-xl font-bold text-[#3f403c] truncate">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-xs font-medium text-[#58554e]">
                      Created: {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center justify-between text-sm font-bold text-[#3f403c]">
                    <span>Open Editor</span>
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
