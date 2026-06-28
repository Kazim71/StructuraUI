"use client";

import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { saveLayoutState } from "@/app/actions/projects";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function EditorWorkspace() {
  const params = useParams();
  const projectId = params.id as string;
  const editorRef = useRef<any>(null);

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

  // --- RE-ADDED MISSING FUNCTION ---
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
    <div className="flex flex-col h-screen overflow-hidden bg-[#e0dac9] text-[#3f403c]">
      <header className="flex items-center justify-between px-6 py-4 bg-[#f8f7f3] border-b border-[#c7bd9b] shrink-0">
        <div className="flex items-center gap-4">
          <Logo className="h-6" />
        </div>

        <div className="flex items-center space-x-3">
          <input
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Describe layout..."
            className="w-64 px-4 py-2 text-sm bg-white border border-[#c7bd9b] rounded-sm"
          />
          <button onClick={handleGenerate} disabled={isGenerating} className="px-4 py-2 text-sm font-bold text-white bg-[#809bce] rounded-sm">
            {isGenerating ? "Processing..." : "Generate AI Layout"}
          </button>
          <button onClick={handleExport} className="px-4 py-2 text-sm font-bold text-[#3f403c] bg-[#e0dac9] border border-[#c7bd9b] rounded-sm">
            Download Code
          </button>
          <button onClick={toggleDarkMode} className="px-3 py-1.5 text-lg bg-[#e0dac9] border border-[#c7bd9b] rounded-sm transition-colors hover:bg-[#c7bd9b]">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={handleSaveLayout} className="px-6 py-2 text-sm font-bold text-white bg-[#3f403c] rounded-sm">
            Save
          </button>
        </div>
      </header>

      <main className="flex-1 relative w-full h-full">
        <div id="gjs" className="absolute inset-0"></div>
        {showUpgradeModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-[#f8f7f3] border border-[#c7bd9b] p-8 rounded-lg shadow-2xl max-w-md w-full text-center">
              <h2 className="text-2xl font-bold text-[#3f403c] mb-4">Upgrade to Pro</h2>
              <button className="w-full py-3 bg-[#3f403c] text-white rounded-md mb-3" onClick={() => setShowUpgradeModal(false)}>Upgrade Now</button>
              <button className="w-full py-3 bg-[#e0dac9] text-[#3f403c] rounded-md" onClick={() => setShowUpgradeModal(false)}>Maybe Later</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}