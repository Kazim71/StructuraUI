import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from "@/lib/supabase/server";

// Initialize the Google Gen AI client using the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    if (profile.role !== 'admin' && !profile.is_pro && (profile.generations_count || 0) >= 1) {
      return NextResponse.json({ success: false, error: "FREE_LIMIT_REACHED" }, { status: 403 });
    }

    const body = await req.json();
    const { requirements } = body;

    if (!requirements || typeof requirements !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'requirements' field." },
        { status: 400 }
      );
    }

    const systemInstruction = `You are an expert web designer and structured data extractor. 
Analyze the provided user requirements for a website landing page and extract the content into a structured JSON object. 
The JSON object must strictly match the provided schema, encompassing the following standard landing page sections:
1. navbar: Contains logo text and navigation links.
2. hero: Contains the main headline, subheadline, and primary call-to-action button text.
3. features: An array of features, each with a title and description.
4. cta: A secondary call-to-action section with a title, description, and button text.
5. footer: Contains copyright text and footer links.

Return ONLY the valid, minified JSON object. Do NOT wrap the output in markdown code blocks.`;

    // Define a strict schema to guarantee the output structure
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        navbar: {
          type: Type.OBJECT,
          properties: {
            logo: { type: Type.STRING },
            links: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
        hero: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
            ctaButton: { type: Type.STRING },
          },
        },
        features: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
            },
          },
        },
        cta: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            buttonText: { type: Type.STRING },
          },
        },
        footer: {
          type: Type.OBJECT,
          properties: {
            copyright: { type: Type.STRING },
            links: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
      required: ["navbar", "hero", "features", "cta", "footer"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: requirements,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text;
    
    if (!jsonText) {
      throw new Error("No response text returned from Gemini API.");
    }

    // Parse the response to ensure it is valid JSON before sending it to the client
    const parsedData = JSON.parse(jsonText);

    await supabase.from('profiles').update({ generations_count: (profile.generations_count || 0) + 1 }).eq('id', user.id);

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Error in generate API route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
