import { useState } from "react";
import { createWorker } from "tesseract.js";
import { AnimatePresence } from "framer-motion";
import { Copy, Check, ScanText } from "lucide-react";
import FileDropZone from "@/components/FileDropZone";
import ToolHeader from "@/components/ToolHeader";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { Button } from "@/components/ui/button";

const OCRTool = () => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setProcessing(true);
    setProgress(0);
    setText("");

    try {
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data } = await worker.recognize(file);
      setText(data.text);
      await worker.terminate();
    } catch (e) {
      console.error(e);
      setText("Error extracting text. Please try with a clearer image.");
    } finally {
      setProcessing(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <AnimatePresence>
        {processing && <ProcessingOverlay message="Extracting text with OCR..." progress={progress} />}
      </AnimatePresence>
      <ToolHeader
        title="Extract Text (OCR)"
        description="Extract text from images using AI-powered optical character recognition."
      />

      {!text && !processing && (
        <FileDropZone
          accept="image/*"
          multiple={false}
          onFiles={handleFiles}
          label="Drop an image to extract text"
          sublabel="Supports JPG, PNG, WebP — AI-powered OCR"
        />
      )}

      {text && (
        <div className="space-y-4">
          {imagePreview && (
            <div className="bg-surface border border-border/50 rounded-xl p-3">
              <img src={imagePreview} alt="Source" className="max-h-48 rounded-lg object-contain mx-auto" />
            </div>
          )}

          <div className="bg-surface border border-border/50 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <ScanText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Extracted Text</span>
              </div>
              <Button variant="outline" size="sm" onClick={copyText}>
                {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="p-4 text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-y-auto">
              {text}
            </pre>
          </div>

          <Button
            variant="outline"
            onClick={() => { setText(""); setImagePreview(null); }}
          >
            Extract from another image
          </Button>
        </div>
      )}
    </div>
  );
};

export default OCRTool;
