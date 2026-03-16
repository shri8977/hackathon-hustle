import { supabase } from "@/integrations/supabase/client";

export async function aiSummarize(text: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("ai-summarize", {
    body: { text },
  });
  if (error) throw new Error(error.message || "Failed to summarize");
  if (!data?.success) throw new Error(data?.message || "Failed to summarize");
  return data.summary;
}

export async function aiTranslate(text: string, targetLanguage: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("ai-translate", {
    body: { text, targetLanguage },
  });
  if (error) throw new Error(error.message || "Failed to translate");
  if (!data?.success) throw new Error(data?.message || "Failed to translate");
  return data.translation;
}

export async function aiGenerateQuestions(text: string, questionCount: number = 5): Promise<string> {
  const { data, error } = await supabase.functions.invoke("ai-questions", {
    body: { text, questionCount },
  });
  if (error) throw new Error(error.message || "Failed to generate questions");
  if (!data?.success) throw new Error(data?.message || "Failed to generate questions");
  return data.questions;
}
