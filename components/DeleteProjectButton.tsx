"use client";

import { useTransition } from "react";
import { deleteProject } from "@/app/actions/projects";

export default function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteProject(projectId);
      if (!result.success) {
        alert(result.error || "Failed to delete project");
      }
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      aria-label="Delete project"
      className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 dark:bg-[#26251f]/90 border border-[#c7bd9b] dark:border-[#4a4940] text-[#58554e] dark:text-[#b8b4a8] opacity-0 group-hover:opacity-100 hover:bg-[#fbeaea] hover:text-[#c0392b] hover:border-[#c0392b]/40 transition-all disabled:opacity-50"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}
