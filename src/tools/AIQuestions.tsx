import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Copy, Check, HelpCircle } from "lucide-react";
import FileDropZone from "@/components/FileDropZone";
import ToolHeader from "@/components/ToolHeader";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { aiGenerateQuestions } from "@/lib/ai-api";

const AIQuestions = () => {
  const [processing, setProcessing] = useState(false);
  const [inputText, setInputText] = useState("");
  const [questions, setQuestions] = useState("");
  const [questionCount, setQuestionCount] = useState([5]);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum 20MB.", variant: "destructive" });
      return;
    }
    const text = await file.text();
    setInputText(text.slice(0, 15000));
  };

  const generate = async () => {
    if (!inputText.trim()) {
      toast({ title: "No text", description: "Please provide text.", variant: "destructive" });
      return;
    }
    setProcessing(true);
    try {
      const result = await aiGenerateQuestions(inputText, questionCount[0]);
      setQuestions(result);
      toast({ title: "Questions generated!" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(questions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <AnimatePresence>{processing && <ProcessingOverlay message="Generating questions..." />}</AnimatePresence>
      <ToolHeader title="AI Question Generator" description="Generate study questions from any text or document using AI." />

      {!questions && (
        <div className="space-y-4">
          <div className="bg-surface border border-border/50 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Number of Questions</label>
              <span className="mono-text text-muted-foreground tabular-nums">{questionCount[0]}</span>
            </div>
            <Slider value={questionCount} onValueChange={setQuestionCount} min={3} max={15} step={1} />
          </div>

          <Textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Paste your study material here..." className="min-h-[200px]" />

          <FileDropZone accept=".txt,.md,.csv" multiple={false} onFiles={handleFiles} label="Or drop a text file" sublabel="Supports TXT, MD, CSV" />

          {inputText && (
            <Button onClick={generate} size="lg">
              <HelpCircle className="w-4 h-4 mr-2" />
              Generate {questionCount[0]} Questions
            </Button>
          )}
        </div>
      )}

      {questions && (
        <div className="space-y-4">
          <div className="bg-surface border border-border/50 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Generated Questions</span>
              </div>
              <Button variant="outline" size="sm" onClick={copyText}>
                {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {questions}
            </div>
          </div>
          <Button variant="outline" onClick={() => { setQuestions(""); setInputText(""); }}>
            Generate from another document
          </Button>
        </div>
      )}
    </div>
  );
};

export default AIQuestions;
