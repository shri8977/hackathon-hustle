import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Copy, Check, Languages } from "lucide-react";
import FileDropZone from "@/components/FileDropZone";
import ToolHeader from "@/components/ToolHeader";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { aiTranslate } from "@/lib/ai-api";

const LANGUAGES = [
  "Spanish", "French", "German", "Italian", "Portuguese", "Chinese", "Japanese",
  "Korean", "Arabic", "Hindi", "Russian", "Dutch", "Swedish", "Turkish", "Polish",
];

const AITranslate = () => {
  const [processing, setProcessing] = useState(false);
  const [inputText, setInputText] = useState("");
  const [translation, setTranslation] = useState("");
  const [targetLang, setTargetLang] = useState("Spanish");
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

  const translate = async () => {
    if (!inputText.trim()) {
      toast({ title: "No text", description: "Please provide text.", variant: "destructive" });
      return;
    }
    setProcessing(true);
    try {
      const result = await aiTranslate(inputText, targetLang);
      setTranslation(result);
      toast({ title: "Translation complete!" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <AnimatePresence>{processing && <ProcessingOverlay message="Translating..." />}</AnimatePresence>
      <ToolHeader title="AI Translate" description="Translate text or documents into any language using AI." />

      {!translation && (
        <div className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">Target Language</label>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Paste text to translate..." className="min-h-[200px]" />

          <FileDropZone accept=".txt,.md,.csv" multiple={false} onFiles={handleFiles} label="Or drop a text file" sublabel="Supports TXT, MD, CSV" />

          {inputText && (
            <Button onClick={translate} size="lg">
              <Languages className="w-4 h-4 mr-2" />
              Translate to {targetLang}
            </Button>
          )}
        </div>
      )}

      {translation && (
        <div className="space-y-4">
          <div className="bg-surface border border-border/50 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Translation ({targetLang})</span>
              </div>
              <Button variant="outline" size="sm" onClick={copyText}>
                {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {translation}
            </div>
          </div>
          <Button variant="outline" onClick={() => { setTranslation(""); setInputText(""); }}>
            Translate another document
          </Button>
        </div>
      )}
    </div>
  );
};

export default AITranslate;
