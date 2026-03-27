import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ✅ FULL CORS FIX
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
  "authorization, x-client-info, apikey, content-type",
   "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // 🔥 HANDLE PREFLIGHT (VERY IMPORTANT)
  if (req.method === "OPTIONS") {
  return new Response(null, { headers: corsHeaders });
}
  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ success: false, message: "No text provided" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // 🔥 CALL AI API
    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content:
                "You are a document summarization expert. Create clear, concise summaries with bullet points.",
            },
            {
              role: "user",
              content: `Summarize this:\n\n${text.slice(0, 15000)}`,
            },
          ],
        }),
      }
    );

    // 🔥 HANDLE API ERRORS
    if (!response.ok) {
      const status = response.status;

      if (status === 429) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Rate limit exceeded. Try later.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (status === 402) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Credits exhausted.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();

    const summary =
      data?.choices?.[0]?.message?.content ||
      "Could not generate summary.";

    // ✅ SUCCESS RESPONSE
    return new Response(
      JSON.stringify({ success: true, summary }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    // ❌ ERROR RESPONSE
    return new Response(
      JSON.stringify({
        success: false,
        message: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
