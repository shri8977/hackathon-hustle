import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    const questions = [
      "What is the main idea?",
      "What are key points?",
      "Explain the topic briefly.",
    ];

    return new Response(
      JSON.stringify({
        success: true,
        questions,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ success: false }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
