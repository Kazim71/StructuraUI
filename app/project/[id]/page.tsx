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
  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !editorRef.current) {
      editorRef.current = grapesjs.init({
        container: "#gjs",
        height: "100%",
        width: "100%",
        storageManager: { type: "none" }, // Disable local storage
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

      const response = await saveLayoutState(
        projectId,
        canvasJson,
        customCss || ""
      );

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

      // 1. Navbar mapping
      if (navbar) {
        const linksHtml =
          navbar.links
            ?.map(
              (l: string) =>
                `<a href="#" style="margin-left: 20px; color: #333; text-decoration: none; font-weight: 500;">${l}</a>`
            )
            .join("") || "";
        htmlString += `
          <nav style="display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: #ffffff; border-bottom: 1px solid #eaeaea;">
            <div style="font-size: 24px; font-weight: bold; color: #111;">${
              navbar.logo || "Logo"
            }</div>
            <div style="display: flex; gap: 15px;">${linksHtml}</div>
          </nav>
        `;
      }

      // 2. Hero mapping
      if (hero) {
        htmlString += `
          <header style="padding: 120px 20px; text-align: center; background: #f8f9fa;">
            <h1 style="font-size: 56px; font-weight: 800; margin-bottom: 24px; color: #111;">${
              hero.headline || "Headline"
            }</h1>
            <p style="font-size: 22px; color: #555; margin-bottom: 40px; max-width: 700px; margin-left: auto; margin-right: auto; line-height: 1.6;">${
              hero.subheadline || "Subheadline"
            }</p>
            ${
              hero.ctaButton
                ? `<button style="padding: 16px 32px; font-size: 18px; background: #0f172a; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">${hero.ctaButton}</button>`
                : ""
            }
          </header>
        `;
      }

      // 3. Features mapping
      if (features && features.length > 0) {
        const featuresHtml = features
          .map(
            (f: any) => `
          <div style="flex: 1; min-width: 300px; padding: 32px; text-align: left; background: #ffffff; border: 1px solid #eaeaea; border-radius: 12px; margin: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #111;">${f.title}</h3>
            <p style="color: #666; line-height: 1.6; font-size: 16px;">${f.description}</p>
          </div>
        `
          )
          .join("");

        htmlString += `
          <section style="padding: 80px 20px; background: #ffffff;">
            <div style="max-width: 1200px; margin: 0 auto;">
              <div style="display: flex; flex-wrap: wrap; justify-content: center; margin: -16px;">
                ${featuresHtml}
              </div>
            </div>
          </section>
        `;
      }

      // 4. CTA mapping
      if (cta) {
        htmlString += `
          <section style="padding: 100px 20px; text-align: center; background: #0f172a; color: #ffffff;">
            <h2 style="font-size: 42px; font-weight: 800; margin-bottom: 24px;">${
              cta.title || "CTA Title"
            }</h2>
            <p style="font-size: 20px; margin-bottom: 40px; opacity: 0.9; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">${
              cta.description || "CTA Description"
            }</p>
            ${
              cta.buttonText
                ? `<button style="padding: 16px 36px; font-size: 18px; background: #ffffff; color: #0f172a; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">${cta.buttonText}</button>`
                : ""
            }
          </section>
        `;
      }

      // 5. Footer mapping
      if (footer) {
        const footerLinks =
          footer.links
            ?.map(
              (l: string) =>
                `<a href="#" style="margin: 0 15px; color: #888; text-decoration: none; font-size: 14px;">${l}</a>`
            )
            .join("") || "";
        htmlString += `
          <footer style="padding: 60px 20px; text-align: center; background: #f8f9fa; border-top: 1px solid #eaeaea;">
            <div style="margin-bottom: 24px;">${footerLinks}</div>
            <p style="color: #666; font-size: 14px;">${
              footer.copyright || "© 2024"
            }</p>
          </footer>
        `;
      }

      // Inject structural HTML into GrapesJS canvas
      editorRef.current.setComponents(htmlString);

    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-900 text-white">
      {/* Styled Header with UI Control Bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-950 border-b border-gray-800 shrink-0">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            StructuraUI Workspace
          </h1>
          <p className="text-xs text-gray-400 mt-1">Project ID: {projectId}</p>
        </div>

        {/* AI Generation Control Bar */}
        <div className="flex items-center space-x-3 max-w-xl w-full mx-6">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Describe your website... (e.g. A sleek portfolio for a software engineer)"
            className="flex-1 px-4 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleGenerate();
              }
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !promptInput.trim()}
            className="px-4 py-2 text-sm font-medium text-indigo-100 bg-indigo-900/50 border border-indigo-500/30 rounded-md hover:bg-indigo-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {isGenerating ? "Processing..." : "Generate AI Layout"}
          </button>
        </div>

        <button
          onClick={handleSaveLayout}
          disabled={isSaving}
          className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 transition-colors shrink-0"
        >
          {isSaving ? "Saving..." : "Save Layout"}
        </button>
      </header>

      {/* Main Canvas Area */}
      <main className="flex-1 relative w-full h-full">
        <div id="gjs" className="absolute inset-0"></div>
      </main>
    </div>
  );
}
