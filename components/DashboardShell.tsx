"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

type Project = {
  id: string;
  name: string;
  created_at: string;
};

export default function DashboardShell({
  userEmail,
  projects,
  logoutAction,
  createProjectAction,
}: {
  userEmail: string;
  projects: Project[] | null;
  logoutAction: () => Promise<void>;
  createProjectAction: (formData: FormData) => Promise<void>;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f7f3] text-[#3f403c] font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[#e0dac9] border-r border-[#c7bd9b] transition-transform duration-300
          lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Top: Logo */}
        <div className="flex items-center px-6 py-6 border-b border-[#c7bd9b]">
          <Logo className="h-7 text-[#3f403c]" />
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <SidebarLink label="All Projects" active />
          <SidebarLink label="Recent" />
          <SidebarLink label="Drafts" />
          <div className="pt-6">
            <div className="px-3 pb-2 text-xs font-bold uppercase tracking-widest text-[#58554e]/60">
              Settings
            </div>
            <SidebarLink label="Preferences" />
          </div>
        </nav>

        {/* Sidebar Bottom: User */}
        <div className="border-t border-[#c7bd9b] px-5 py-5">
          <p className="text-xs font-bold text-[#58554e] truncate mb-3">
            {userEmail}
          </p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-lg border border-[#c7bd9b] bg-[#f1efe6] px-4 py-2 text-sm font-bold text-[#3f403c] hover:bg-[#e3decd] transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center gap-4 px-6 py-4 bg-[#f8f7f3] border-b border-[#e3decd] shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden shrink-0 p-2 rounded-lg hover:bg-[#e3decd] transition-colors"
          >
            <svg className="h-5 w-5 text-[#3f403c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#58554e]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full rounded-lg border border-[#c7bd9b] bg-[#f1efe6] py-2.5 pl-10 pr-4 text-sm text-[#3f403c] placeholder-[#58554e]/50 focus:border-[#809bce] focus:outline-none focus:ring-2 focus:ring-[#809bce]/20 transition-all"
              />
            </div>
          </div>

          {/* New Project Button */}
          <button
            onClick={() => setShowNewProject(!showNewProject)}
            className="shrink-0 flex items-center gap-2 rounded-lg bg-[#3f403c] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#58554e] transition-colors shadow-md"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </header>

        {/* New Project Inline Form */}
        {showNewProject && (
          <div className="px-6 py-4 bg-[#f1efe6] border-b border-[#e3decd]">
            <form
              action={async (formData) => {
                await createProjectAction(formData);
              }}
              className="flex items-center gap-3 max-w-lg"
            >
              <input
                name="name"
                required
                placeholder="Enter project name..."
                className="flex-1 rounded-lg border border-[#c7bd9b] bg-white px-4 py-2.5 text-sm text-[#3f403c] placeholder-[#58554e]/50 focus:border-[#809bce] focus:outline-none focus:ring-2 focus:ring-[#809bce]/20 transition-all"
                autoFocus
              />
              <button
                type="submit"
                className="rounded-lg bg-[#3f403c] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#58554e] transition-colors shadow-sm"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowNewProject(false)}
                className="rounded-lg border border-[#c7bd9b] bg-[#f8f7f3] px-4 py-2.5 text-sm font-bold text-[#58554e] hover:bg-[#e3decd] transition-colors"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Project Grid */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {!projects || projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f1efe6] border border-[#c7bd9b]">
                <svg className="h-10 w-10 text-[#58554e]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#3f403c] mb-2">No projects yet</h2>
              <p className="text-sm text-[#58554e] max-w-sm mb-6">
                Create your first project to start building beautiful, structured web layouts.
              </p>
              <button
                onClick={() => setShowNewProject(true)}
                className="rounded-lg bg-[#3f403c] px-6 py-3 text-sm font-bold text-white hover:bg-[#58554e] transition-colors shadow-md"
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/project/${project.id}`}
                  className="group flex flex-col rounded-xl border border-[#c7bd9b] bg-white overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#809bce]"
                >
                  {/* Preview Area */}
                  <div className="relative h-40 bg-[#f1efe6] flex items-center justify-center border-b border-[#c7bd9b]/50">
                    <div className="flex flex-col items-center gap-2 opacity-40 group-hover:opacity-60 transition-opacity">
                      <svg className="h-10 w-10 text-[#58554e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
                      </svg>
                      <span className="text-xs font-bold text-[#58554e]">Layout Preview</span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 py-3.5 flex items-center justify-between">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#3f403c] truncate">
                        {project.name}
                      </h3>
                      <p className="text-xs text-[#58554e]/70 mt-0.5">
                        {new Date(project.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <svg className="h-4 w-4 text-[#58554e]/40 group-hover:text-[#809bce] transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
        active
          ? "bg-[#f1efe6] text-[#3f403c] shadow-sm"
          : "text-[#58554e] hover:bg-[#f1efe6]/60 hover:text-[#3f403c]"
      }`}
    >
      {label}
    </button>
  );
}
