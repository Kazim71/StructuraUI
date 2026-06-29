"use client";

import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { saveLayoutState } from "@/app/actions/projects";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";
import Link from "next/link";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useTheme } from "next-themes";

export default function EditorWorkspace() {
  const params = useParams();
  const projectId = params.id as string;
  const editorRef = useRef<any>(null);
  const { theme, setTheme } = useTheme();

  const [isSaving, setIsSaving] = useState(false);
  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (typeof window !== "undefined" && !editorRef.current) {
      editorRef.current = grapesjs.init({
        container: "#gjs",
        height: "100%",
        width: "100%",
        storageManager: { type: "none" },
        blockManager: {
          appendTo: '',
          blocks: [
            { id: 'section', label: 'Section', category: 'Layout', content: '<section class="p-16 min-h-[250px] flex flex-col items-center justify-center bg-[#f8f7f3] border-y border-[#c7bd9b]"><h2 class="text-4xl font-bold text-[#3f403c] mb-4">New Section</h2></section>' },
            { id: '2-columns', label: '2 Columns', category: 'Layout', content: '<div class="flex flex-col md:flex-row gap-8 p-10 bg-[#e0dac9]"><div class="flex-1 p-8 bg-[#f1efe6] border border-[#c7bd9b]">Column 1</div><div class="flex-1 p-8 bg-[#f1efe6] border border-[#c7bd9b]">Column 2</div></div>' },
            { id: 'text', label: 'Text', category: 'Typography', content: '<p class="text-lg text-[#3f403c] p-2">Double click to edit.</p>' },
            { id: 'button', label: 'Button', category: 'Elements', content: '<button class="bg-[#3f403c] text-white px-8 py-4 rounded-sm font-bold">Click Me</button>' }
          ]
        }
      });

      const loadSavedLayout = async () => {
        const { data } = await supabase.from("layout_state").select("*").eq("project_id", projectId).single();
        if (data) {
          if (data.canvas_json) editorRef.current.loadProjectData(data.canvas_json);
          else if (data.html_state) {
            editorRef.current.setComponents(data.html_state);
            if (data.css_state) editorRef.current.setStyle(data.css_state);
          }
        }
      };
      loadSavedLayout();
    }
  }, [projectId, supabase]);

  const toggleDarkMode = () => {
    if (!editorRef.current) return;

    setTheme(theme === "dark" ? "light" : "dark");

    setIsDarkMode((prev) => {
      const newDark = !prev;
      const canvas = editorRef.current.Canvas.getBody();
      if (canvas) {
        if (newDark) {
          canvas.classList.add('dark-mode');
        } else {
          canvas.classList.remove('dark-mode');
        }
        canvas.style.backgroundColor = newDark ? '#1f2937' : '#f8f7f3';
        canvas.style.color = newDark ? '#ffffff' : '#3f403c';
        canvas.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      }

      // Also set the iframe frame background to match, in case body doesn't fill 100% height
      const frameEl = editorRef.current.Canvas.getFrameEl();
      if (frameEl) {
        frameEl.style.backgroundColor = newDark ? '#1f2937' : '#f8f7f3';
      }

      return newDark;
    });
  };

  const handleSaveLayout = async () => {
    if (!editorRef.current) return;
    setIsSaving(true);
    const canvasJson = editorRef.current.getProjectData();
    const customCss = editorRef.current.getCss();
    const response = await saveLayoutState(projectId, canvasJson, customCss || "");
    if (response.success) alert("Saved!");
    else alert("Error saving: " + response.error);
    setIsSaving(false);
  };

  const handleGenerate = async () => {
    if (!promptInput.trim() || !editorRef.current) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirements: promptInput }),
      });

      if (res.status === 403) {
        setShowUpgradeModal(true);
        setIsGenerating(false);
        return;
      }

      const json = await res.json();
      if (json.success && json.data) {
        // Basic rendering logic (customize based on your generator response)
        editorRef.current.setComponents(json.data.html || "<div>Generated Layout</div>");
      }
    } catch (error) {
      alert("Error generating layout.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (!editorRef.current) return;
    const zip = new JSZip();
    zip.file("index.html", `<html><body>${editorRef.current.getHtml()}</body></html>`);
    zip.file("styles.css", editorRef.current.getCss() || "");
    zip.generateAsync({ type: "blob" }).then((content) => saveAs(content, "export.zip"));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#e5e5e5] text-[#3f403c]">
      {/* GrapesJS canvas modernization: strip the default chrome and float the
          editable page like a Figma frame on an infinite gray workspace. */}
      <style>{`
        .gjs-cv-canvas {
          box-shadow: none !important;
          border: none !important;
          background: #e5e5e5 !important;
        }
        .gjs-cv-canvas-bg {
          background-color: #e5e5e5 !important;
        }
        .gjs-frame-wrapper {
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18) !important;
          border-radius: 6px !important;
          overflow: hidden;
        }
        .gjs-frame {
          border: none !important;
          background: #ffffff;
        }
      `}</style>

      {/* Toolbar: compact, three-zone Figma-style header */}
      <header className="h-14 flex items-center gap-4 px-4 bg-[#f8f7f3] dark:bg-[#2b2a27] border-b border-[#c7bd9b] dark:border-[#4a4940] shrink-0 z-10">
        {/* Left: Logo + Project ID */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard" className="shrink-0">
            <Logo className="h-5 text-[#3f403c] dark:text-[#e8e6df]" />
          </Link>
          <div className="h-5 w-px bg-[#c7bd9b] dark:bg-[#4a4940] shrink-0" />
          <span className="text-xs font-medium text-[#58554e]/80 dark:text-[#b8b4a8]/80 truncate">
            Project {projectId?.slice(0, 8)}
          </span>
        </div>

        {/* Center: AI prompt bar */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 w-full max-w-md">
            <input
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Describe a layout to generate..."
              className="flex-1 bg-white dark:bg-[#322f28] border border-[#c7bd9b] dark:border-[#4a4940] rounded-md px-4 py-1.5 text-sm text-[#3f403c] dark:text-[#e8e6df] placeholder-[#a0a5b8]/70 dark:placeholder-[#b8b4a8]/50 focus:outline-none focus:ring-1 focus:ring-[#3f403c] dark:focus:ring-[#e8e6df] focus:border-[#3f403c] dark:focus:border-[#e8e6df] transition-all"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="shrink-0 bg-[#3f403c] dark:bg-[#e8e6df] text-[#f8f7f3] dark:text-[#26251f] hover:bg-[#58554e] dark:hover:bg-[#c7bd9b] transition-colors px-4 py-1.5 text-sm font-medium rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {/* Right: Export, theme, save */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExport}
            className="bg-white dark:bg-[#322f28] text-[#3f403c] dark:text-[#e8e6df] border border-[#c7bd9b] dark:border-[#4a4940] hover:bg-[#e0dac9]/30 dark:hover:bg-[#3f403c] transition-colors px-4 py-1.5 text-sm font-medium rounded-md shadow-sm"
          >
            Download Code
          </button>
          <button onClick={toggleDarkMode} className="p-2 flex items-center justify-center rounded-lg border border-[#c7bd9b] dark:border-[#58554e] hover:bg-[#e3decd] dark:hover:bg-[#3f403c] transition-colors" aria-label="Toggle theme">
            <svg className="h-5 w-5 text-[#58554e] dark:text-[#e8e6df]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          </button>
          <button
            onClick={handleSaveLayout}
            disabled={isSaving}
            className="bg-[#3f403c] dark:bg-[#e8e6df] text-white dark:text-[#26251f] hover:bg-[#58554e] dark:hover:bg-[#c7bd9b] transition-colors px-5 py-1.5 text-sm font-bold rounded-md shadow-sm disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </header>

      <main className="flex-1 relative w-full h-full">
        <div id="gjs" className="absolute inset-0"></div>

        {showUpgradeModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-center overflow-hidden">
              <div className="px-8 pt-8 pb-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-2xl">
                  ✨
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Upgrade to Pro</h2>
                <p className="text-sm text-gray-500">
                  You&rsquo;ve reached your free AI generation limit. Upgrade to Pro for unlimited layout generations.
                </p>
              </div>
              <div className="px-8 pb-8 flex flex-col gap-2">
                <button
                  className="w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                  onClick={() => setShowUpgradeModal(false)}
                >
                  Upgrade Now
                </button>
                <button
                  className="w-full py-2.5 text-gray-500 text-sm font-medium hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setShowUpgradeModal(false)}
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
