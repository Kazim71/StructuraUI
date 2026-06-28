"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

type Project = {
  id: string;
  name: string;
  created_at: string;
};

export default function DashboardShell({
  userEmail,
  userRole,
  logoutAction,
  createProjectAction,
  children,
}: {
  userEmail: string;
  userRole?: string;
  logoutAction: () => Promise<void>;
  createProjectAction: (formData: FormData) => Promise<void>;
  children?: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f7f3] dark:bg-[#26251f] text-[#3f403c] dark:text-[#e8e6df] font-sans">
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
          fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[#e0dac9] dark:bg-[#322f28] border-r border-[#c7bd9b] dark:border-[#4a4940] transition-transform duration-300
          lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Top: Logo */}
        <div className="flex items-center px-6 py-6 border-b border-[#c7bd9b] dark:border-[#4a4940]">
          <Logo className="h-7 text-[#3f403c] dark:text-[#e8e6df]" />
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <SidebarLink label="All Projects" active />
          <SidebarLink label="Recent" />
          <SidebarLink label="Drafts" />
          {userRole === "admin" && <SidebarLink label="Admin Panel" />}
          <div className="pt-6">
            <div className="px-3 pb-2 text-xs font-bold uppercase tracking-widest text-[#58554e]/60 dark:text-[#b8b4a8]/60">
              Settings
            </div>
            <SidebarLink label="Preferences" />
          </div>
        </nav>

        {/* Sidebar Bottom: User */}
        <div className="border-t border-[#c7bd9b] dark:border-[#4a4940] px-5 py-5">
          <p className="text-xs font-bold text-[#58554e] dark:text-[#b8b4a8] truncate mb-3">
            {userEmail}
          </p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-lg border border-[#c7bd9b] dark:border-[#4a4940] bg-[#f1efe6] dark:bg-[#26251f] px-4 py-2 text-sm font-bold text-[#3f403c] dark:text-[#e8e6df] hover:bg-[#e3decd] dark:hover:bg-[#3f403c] transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center gap-4 px-6 py-4 bg-[#f8f7f3] dark:bg-[#26251f] border-b border-[#e3decd] dark:border-[#4a4940] shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden shrink-0 p-2 rounded-lg hover:bg-[#e3decd] dark:hover:bg-[#3f403c] transition-colors"
          >
            <svg className="h-5 w-5 text-[#3f403c] dark:text-[#e8e6df]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#58554e]/50 dark:text-[#b8b4a8]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full rounded-lg border border-[#c7bd9b] dark:border-[#4a4940] bg-[#f1efe6] dark:bg-[#322f28] py-2.5 pl-10 pr-4 text-sm text-[#3f403c] dark:text-[#e8e6df] placeholder-[#58554e]/50 dark:placeholder-[#b8b4a8]/50 focus:border-[#809bce] focus:outline-none focus:ring-2 focus:ring-[#809bce]/20 transition-all"
              />
            </div>
          </div>

          {/* New Project Button */}
          <button
            onClick={() => setShowNewProject(!showNewProject)}
            className="shrink-0 flex items-center gap-2 rounded-lg bg-[#3f403c] dark:bg-[#e8e6df] px-5 py-2.5 text-sm font-bold text-white dark:text-[#26251f] hover:bg-[#58554e] dark:hover:bg-[#c7bd9b] transition-colors shadow-md"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </header>

        {/* New Project Inline Form */}
        {showNewProject && (
          <div className="px-6 py-4 bg-[#f1efe6] dark:bg-[#322f28] border-b border-[#e3decd] dark:border-[#4a4940]">
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
                className="flex-1 rounded-lg border border-[#c7bd9b] dark:border-[#4a4940] bg-white dark:bg-[#26251f] px-4 py-2.5 text-sm text-[#3f403c] dark:text-[#e8e6df] placeholder-[#58554e]/50 dark:placeholder-[#b8b4a8]/50 focus:border-[#809bce] focus:outline-none focus:ring-2 focus:ring-[#809bce]/20 transition-all"
                autoFocus
              />
              <button
                type="submit"
                className="rounded-lg bg-[#3f403c] dark:bg-[#e8e6df] px-6 py-2.5 text-sm font-bold text-white dark:text-[#26251f] hover:bg-[#58554e] dark:hover:bg-[#c7bd9b] transition-colors shadow-sm"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowNewProject(false)}
                className="rounded-lg border border-[#c7bd9b] dark:border-[#4a4940] bg-[#f8f7f3] dark:bg-[#26251f] px-4 py-2.5 text-sm font-bold text-[#58554e] dark:text-[#b8b4a8] hover:bg-[#e3decd] dark:hover:bg-[#3f403c] transition-colors"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
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
          ? "bg-[#f1efe6] dark:bg-[#26251f] text-[#3f403c] dark:text-[#e8e6df] shadow-sm"
          : "text-[#58554e] dark:text-[#b8b4a8] hover:bg-[#f1efe6]/60 dark:hover:bg-[#26251f]/60 hover:text-[#3f403c] dark:hover:text-[#e8e6df]"
      }`}
    >
      {label}
    </button>
  );
}
