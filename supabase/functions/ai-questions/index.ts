import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function callGemini(prompt: string, systemPrompt: string) {
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (response.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
  if (!response.ok) {
    const err = await response.text();
    console.error("Gemini error:", response.status, err);
    throw new Error("AI service error");
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("AI returned empty response");
  return text;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text, questionCount = 5 } = await req.json();
    if (!text) {
      return new Response(JSON.stringify({ success: false, message: "No text provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const questionsText = await callGemini(
      `Generate ${questionCount} comprehension questions based on this text:\n\n${text.slice(0, 15000)}`,
      "You are an educational expert. Generate clear, thought-provoking comprehension questions that test understanding of the text. Number each question. Include a mix of factual and analytical questions."
    );

    // Return as array of questions
    const questions = questionsText
      .split(/\n/)
      .map(q => q.trim())
      .filter(q => q.length > 5);

    return new Response(JSON.stringify({ success: true, questions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: err.message || "Something went wrong" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
