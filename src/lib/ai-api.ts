const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function callEdgeFunction(functionName: string, payload: any) {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/${functionName}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || `Function failed: ${response.status}`);
  }

  return response.json();
}

export async function aiSummarize(text: string): Promise<string> {
  const data = await callEdgeFunction("ai-summarize", { text });
  if (!data?.success) throw new Error(data?.message || "Failed to summarize");
  return data.summary;
}

export async function aiTranslate(text: string, targetLanguage: string): Promise<string> {
  const data = await callEdgeFunction("ai-translate", { text, targetLanguage });
  if (!data?.success) throw new Error(data?.message || "Failed to translate");
  return data.translation;
}

export async function aiGenerateQuestions(text: string, questionCount: number = 5): Promise<string> {
  const data = await callEdgeFunction("ai-questions", { text, questionCount });
  if (!data?.success) throw new Error(data?.message || "Failed to generate questions");
  return data.questions;
}
