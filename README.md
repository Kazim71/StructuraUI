# StructuraUI

A modern, drag-and-drop website builder backed by Supabase, Next.js, and Google Gemini AI.

## Project Phases Completed
- **Phase 1**: Initial Next.js scaffold and Supabase client setup.
- **Phase 2**: Supabase Server Actions for database mutations (`projects`, `layout_state`).
- **Phase 3**: Gemini AI Content Generation API Route integration.
- **Phase 4**: GrapesJS Editor Workspace configuration.
- **Phase 5**: AI to GrapesJS Canvas direct injection.
- **Phase 6**: Authentication, Route Protection (Middleware), and User Dashboard.

## Setup Instructions
1. Run `npm install` to install all dependencies including `@supabase/ssr`, `@google/genai`, and `grapesjs`.
2. Ensure your `.env.local` contains:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
3. Run `npm run dev` to start the local development server.
