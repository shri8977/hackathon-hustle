import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Copy, Check, Sparkles, FileText } from "lucide-react";
import FileDropZone from "@/components/FileDropZone";
import ToolHeader from "@/components/ToolHeader";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { aiSummarize } from "@/lib/ai-api";

const AISummarize = () => {
  const [processing, setProcessing] = useState(false);
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"paste" | "file">("paste");
  const { toast } = useToast();

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 20MB.", variant: "destructive" });
      return;
    }
    const text = await file.text();
    setInputText(text.slice(0, 15000));
  };

  const summarize = async () => {
    if (!inputText.trim()) {
      toast({ title: "No text", description: "Please provide text to summarize.", variant: "destructive" });
      return;
    }
    setProcessing(true);
    try {
      const result = await aiSummarize(inputText);
      setSummary(result);
      toast({ title: "Summary generated!" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <AnimatePresence>{processing && <ProcessingOverlay message="AI is summarizing..." />}</AnimatePresence>
      <ToolHeader title="AI Summarize" description="Upload a document or paste text to get an AI-powered summary." />

      {!summary && (
        <>
          <div className="flex gap-2 mb-6">
            <button onClick={() => setMode("paste")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "paste" ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:text-foreground border border-border/50"}`}>
              Paste Text
            </button>
            <button onClick={() => setMode("file")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "file" ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:text-foreground border border-border/50"}`}>
              Upload File
            </button>
          </div>

          {mode === "file" ? (
            <FileDropZone accept=".txt,.md,.csv" multiple={false} onFiles={handleFiles} label="Drop a text file" sublabel="Supports TXT, MD, CSV — Max 20MB" />
          ) : (
            <Textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Paste your text here..." className="min-h-[200px] mb-4" />
          )}

          {inputText && (
            <Button onClick={summarize} size="lg" className="mt-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Summarize with AI
            </Button>
          )}
        </>
      )}

      {summary && (
        <div className="space-y-4">
          <div className="bg-surface border border-border/50 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">AI Summary</span>
              </div>
              <Button variant="outline" size="sm" onClick={copyText}>
                {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {summary}
            </div>
          </div>
          <Button variant="outline" onClick={() => { setSummary(""); setInputText(""); }}>
            Summarize another document
          </Button>
        </div>
      )}
    </div>
  );
};

export default AISummarize;
