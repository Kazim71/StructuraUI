"use client";

import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import { saveLayoutState } from "@/app/actions/projects";
import { useParams } from "next/navigation";

export default function EditorWorkspace() {
  const params = useParams();
  const projectId = params.id as string;
  const editorRef = useRef<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !editorRef.current) {
      editorRef.current = grapesjs.init({
        container: "#gjs",
        height: "100%",
        width: "100%",
        storageManager: { type: "none" }, // Disable local storage
        // By omitting the panels configuration or keeping it basic,
        // GrapesJS enables its built-in style manager panels by default.
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const handleSaveLayout = async () => {
    if (!editorRef.current) return;
    setIsSaving(true);

    try {
      // Pull structural HTML/CSS and component state
      const canvasJson = editorRef.current.getProjectData();
      const customCss = editorRef.current.getCss();

      const response = await saveLayoutState(projectId, canvasJson, customCss || "");
      
      if (response.success) {
        alert("Layout saved successfully!");
      } else {
        alert("Error saving layout: " + response.error);
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-900 text-white">
      {/* Styled Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-950 border-b border-gray-800">
        <div>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            StructuraUI Workspace
          </h1>
          <p className="text-sm text-gray-400">Editing Project: {projectId}</p>
        </div>
        <button
          onClick={handleSaveLayout}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 transition-colors"
        >
          {isSaving ? "Saving..." : "Save Layout"}
        </button>
      </header>

      {/* Main Canvas Area */}
      <main className="flex-1 relative">
        <div id="gjs" className="absolute inset-0"></div>
      </main>
    </div>
  );
}
