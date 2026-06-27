# StructuraUI Architecture

## Overview
StructuraUI is a modern, drag-and-drop website builder powered by Next.js, Supabase, GrapesJS, and Google Gemini AI.

## Data Flow & Components

### 1. The Frontend (Next.js & GrapesJS)
- **App Router**: Uses Next.js 14+ for routing and React Server Components.
- **GrapesJS Editor**: Located at `/project/[id]`, this serves as the client-side canvas. It allows users to visually edit HTML/CSS. The editor interacts with Supabase via Server Actions to persist the layout state (`saveLayoutState`).

### 2. The Backend (Supabase & Server Actions)
- **Auth**: Uses `@supabase/ssr` to securely handle user sessions via cookies. Middleware intercepts requests to protect `/dashboard` and `/project` routes.
- **Database**:
  - `projects`: Stores project metadata (id, name, user_id).
  - `layout_state`: Stores the actual GrapesJS canvas payload (`canvas_json`, `custom_css`) keyed by `project_id`.
- **Server Actions**: Server-side logic for authentication (`login`, `signup`, `logout`) and database mutations (`createProject`, `saveLayoutState`).

### 3. AI Generation (Google Gemini)
- **Endpoint**: `/api/generate` route acts as the AI bridge.
- **Workflow**: 
  1. User enters text prompt in the GrapesJS workspace.
  2. The prompt is sent to the API.
  3. The Gemini `gemini-2.5-flash` model processes the text using a strict `responseSchema`.
  4. The API parses the structured JSON and maps it to semantic HTML.
  5. The HTML is injected directly into the active GrapesJS canvas using `editor.setComponents()`.
