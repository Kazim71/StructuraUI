"use client";

import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { saveLayoutState } from "@/app/actions/projects";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

export default function EditorWorkspace() {
  const params = useParams();
  const projectId = params.id as string;
  const editorRef = useRef<any>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
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
            {
              id: 'section',
              label: '<b class="text-sm">Section</b>',
              category: 'Layout',
              content: '<section class="p-16 min-h-[250px] flex flex-col items-center justify-center bg-[#f8f7f3] border-y border-[#c7bd9b]"><h2 class="text-4xl font-bold text-[#3f403c] mb-4">New Section</h2><p class="text-[#58554e] text-lg">Drag elements inside here</p></section>',
            },
            {
              id: '2-columns',
              label: '<b class="text-sm">2 Columns</b>',
              category: 'Layout',
              content: '<div class="flex flex-col md:flex-row gap-8 p-10 bg-[#e0dac9]"><div class="flex-1 p-8 bg-[#f1efe6] rounded-sm border border-[#c7bd9b] min-h-[150px]">Column 1</div><div class="flex-1 p-8 bg-[#f1efe6] rounded-sm border border-[#c7bd9b] min-h-[150px]">Column 2</div></div>',
            },
            {
              id: 'text',
              label: '<b class="text-sm">Text Box</b>',
              category: 'Typography',
              content: '<p data-gjs-type="text" class="text-lg text-[#3f403c] leading-relaxed p-2">Double click to edit this typography.</p>',
            },
            {
              id: 'heading',
              label: '<b class="text-sm">Heading</b>',
              category: 'Typography',
              content: '<h1 data-gjs-type="text" class="text-5xl font-bold text-[#3f403c] p-2">Main Heading</h1>',
            },
            {
              id: 'button',
              label: '<b class="text-sm">Button</b>',
              category: 'Elements',
              content: '<button class="inline-block bg-[#3f403c] text-[#ffffff] px-8 py-4 rounded-sm font-bold hover:bg-[#58554e] transition-colors">Click Me</button>',
            }
          ]
        }
      });

      const loadSavedLayout = async () => {
        const { data, error } = await supabase
          .from("layout_state") 
          .select("*")
          .eq("project_id", projectId)
          .single();

        if (data && !error) {
          if (data.canvas_json) {
            editorRef.current.loadProjectData(data.canvas_json);
          } else if (data.html_state) {
            editorRef.current.setComponents(data.html_state);
            if (data.css_state) editorRef.current.setStyle(data.css_state);
          }
        }
      };

      loadSavedLayout();
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [projectId, supabase]);

  const handleSaveLayout = async () => {
    if (!editorRef.current) return;
    setIsSaving(true);

    try {
      const canvasJson = editorRef.current.getProjectData();
      const customCss = editorRef.current.getCss();

      const response = await saveLayoutState(
        projectId,
        canvasJson,
        customCss || ""
      );

      if (response.success) {
        console.log("Layout saved successfully!");
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

  const handleGenerate = async () => {
    if (!promptInput.trim() || !editorRef.current) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirements: promptInput }),
      });
      const json = await res.json();

      if (!json.success) {
        alert("Error generating layout: " + json.error);
        return;
      }

      const { navbar, hero, features, cta, footer } = json.data;
      let htmlString = "";

      if (navbar) {
        const linksHtml =
          navbar.links
            ?.map(
              (l: string) =>
                `<a href="#" style="margin-left: 20px; color: #3f403c; text-decoration: none; font-weight: bold;">${l}</a>`
            )
            .join("") || "";
        htmlString += `
          <nav style="display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: #f8f7f3; border-bottom: 1px solid #c7bd9b;">
            <div style="font-size: 24px; font-weight: bold; color: #3f403c;">${
              navbar.logo || "Logo"
            }</div>
            <div style="display: flex; gap: 15px;">${linksHtml}</div>
          </nav>
        `;
      }

      if (hero) {
        htmlString += `
          <header style="padding: 120px 20px; text-align: center; background: #e0dac9;">
            <h1 style="font-size: 56px; font-weight: 800; margin-bottom: 24px; color: #3f403c;">${
              hero.headline || "Headline"
            }</h1>
            <p style="font-size: 22px; color: #58554e; margin-bottom: 40px; max-width: 700px; margin-left: auto; margin-right: auto; line-height: 1.6;">${
              hero.subheadline || "Subheadline"
            }</p>
            ${
              hero.ctaButton
                ? `<button style="padding: 16px 32px; font-size: 18px; background: #3f403c; color: #ffffff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">${hero.ctaButton}</button>`
                : ""
            }
          </header>
        `;
      }

      if (features && features.length > 0) {
        const featuresHtml = features
          .map(
            (f: any) => `
          <div style="flex: 1; min-width: 300px; padding: 32px; text-align: left; background: #f1efe6; border: 1px solid #c7bd9b; border-radius: 4px; margin: 16px;">
            <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #3f403c;">${f.title}</h3>
            <p style="color: #58554e; line-height: 1.6; font-size: 16px;">${f.description}</p>
          </div>
        `
          )
          .join("");

        htmlString += `
          <section style="padding: 80px 20px; background: #f8f7f3;">
            <div style="max-width: 1200px; margin: 0 auto;">
              <div style="display: flex; flex-wrap: wrap; justify-content: center; margin: -16px;">
                ${featuresHtml}
              </div>
            </div>
          </section>
        `;
      }

      if (cta) {
        htmlString += `
          <section style="padding: 100px 20px; text-align: center; background: #3f403c; color: #ffffff;">
            <h2 style="font-size: 42px; font-weight: 800; margin-bottom: 24px;">${
              cta.title || "CTA Title"
            }</h2>
            <p style="font-size: 20px; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6; color: #e3decd;">${
              cta.description || "CTA Description"
            }</p>
            ${
              cta.buttonText
                ? `<button style="padding: 16px 36px; font-size: 18px; background: #f8f7f3; color: #3f403c; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">${cta.buttonText}</button>`
                : ""
            }
          </section>
        `;
      }

      if (footer) {
        const footerLinks =
          footer.links
            ?.map(
              (l: string) =>
                `<a href="#" style="margin: 0 15px; color: #58554e; text-decoration: none; font-size: 14px; font-weight: bold;">${l}</a>`
            )
            .join("") || "";
        htmlString += `
          <footer style="padding: 60px 20px; text-align: center; background: #e0dac9; border-top: 1px solid #c7bd9b;">
            <div style="margin-bottom: 24px;">${footerLinks}</div>
            <p style="color: #3f403c; font-size: 14px; font-weight: bold;">${
              footer.copyright || "© 2026"
            }</p>
          </footer>
        `;
      }

      editorRef.current.setComponents(htmlString);

    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#e0dac9] text-[#3f403c]">
      <header className="flex items-center justify-between px-6 py-4 bg-[#f8f7f3] border-b border-[#c7bd9b] shrink-0">
        <div className="flex items-center gap-4">
          <Logo className="h-6 text-[#3f403c]" />
          <div className="h-6 w-px bg-[#c7bd9b]"></div>
          <p className="text-xs text-[#58554e] font-medium">Project: {projectId.split('-')[0]}</p>
        </div>

        <div className="flex items-center space-x-3 max-w-xl w-full mx-6">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Describe your layout..."
            className="flex-1 px-4 py-2 text-sm bg-[#ffffff] border border-[#c7bd9b] rounded-sm text-[#3f403c] placeholder-[#a0a5b8] focus:outline-none focus:ring-1 focus:ring-[#58554e]"
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGenerate();
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !promptInput.trim()}
            className="px-4 py-2 text-sm font-bold text-[#ffffff] bg-[#809bce] border border-[#809bce] rounded-sm hover:bg-[#95b8d1] focus:outline-none focus:ring-2 focus:ring-[#809bce] disabled:opacity-50 transition-colors whitespace-nowrap shadow-sm"
          >
            {isGenerating ? "Processing..." : "Generate AI Layout"}
          </button>
        </div>

        <button
          onClick={handleSaveLayout}
          disabled={isSaving}
          className="px-6 py-2 text-sm font-bold text-[#ffffff] bg-[#3f403c] rounded-sm hover:bg-[#58554e] focus:outline-none focus:ring-2 focus:ring-[#3f403c] disabled:opacity-50 transition-colors shrink-0 shadow-sm"
        >
          {isSaving ? "Saving..." : "Save Layout"}
        </button>
      </header>

      <main className="flex-1 relative w-full h-full bg-[#e3decd]">
        <div id="gjs" className="absolute inset-0"></div>
      </main>
    </div>
  );
}