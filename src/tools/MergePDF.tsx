import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";
import { X, GripVertical, Download } from "lucide-react";
import FileDropZone from "@/components/FileDropZone";
import ToolHeader from "@/components/ToolHeader";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { Button } from "@/components/ui/button";

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

const MergePDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles.filter((f) => f.type === "application/pdf")]);
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const merge = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((page) => merged.addPage(page));
      }
      const pdfBytes = await merged.save();
      saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "merged.pdf");
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <AnimatePresence>{processing && <ProcessingOverlay message="Merging PDFs..." />}</AnimatePresence>
      <ToolHeader title="Merge PDF" description="Combine multiple PDF files into a single document. Drag to reorder." />

      <FileDropZone
        accept=".pdf"
        onFiles={handleFiles}
        label="Drop PDF files here or click to browse"
        sublabel="No file size limits — processed entirely in your browser"
      />

      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          {files.map((file, i) => (
            <motion.div
              key={`${file.name}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.02 }}
              className="flex items-center gap-3 bg-surface border border-border/50 rounded-lg px-4 py-3"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground flex-1 truncate">{file.name}</span>
              <span className="mono-text text-muted-foreground tabular-nums">
                {(file.size / 1024).toFixed(0)} KB
              </span>
              <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">{files.length} files selected</p>
            <Button onClick={merge} disabled={files.length < 2} size="lg">
              <Download className="w-4 h-4 mr-2" />
              Merge & Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MergePDF;
