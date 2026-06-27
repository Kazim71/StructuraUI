import { createClient } from "@/lib/supabase/server";
import { createProject } from "@/app/actions/projects";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/actions/auth";

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
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Welcome back, {user.email}</p>
          </div>
          <form action={logout}>
            <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Sign Out
            </button>
          </form>
        </header>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Projects</h2>
          <form action={handleCreateProject} className="flex gap-2">
            <input
              name="name"
              placeholder="Project Name"
              className="rounded-md border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Create New Project
            </button>
          </form>
        </div>

        {error ? (
          <div className="text-red-400">
            Error loading projects: {error.message}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects?.length === 0 ? (
              <div className="col-span-full rounded-xl border border-dashed border-gray-700 p-12 text-center text-gray-500">
                No projects found. Create one to get started!
              </div>
            ) : (
              projects?.map((project) => (
                <Link
                  key={project.id}
                  href={`/project/${project.id}`}
                  className="group relative flex flex-col justify-between rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm transition-all hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-500/10"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200 group-hover:text-white truncate">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                      Created on{" "}
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center text-sm font-medium text-indigo-400 group-hover:text-indigo-300">
                    Open Workspace <span className="ml-1">→</span>
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
