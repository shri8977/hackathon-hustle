import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { AnimatePresence } from "framer-motion";
import { Download, Minimize2 } from "lucide-react";
import FileDropZone from "@/components/FileDropZone";
import ToolHeader from "@/components/ToolHeader";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CompressPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ originalSize: number; compressedSize: number; blob: Blob } | null>(null);
  const { toast } = useToast();

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (!f || f.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please upload a PDF.", variant: "destructive" });
      return;
    }
    setFile(f);
    setResult(null);
  };

  const compress = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      
      // Re-save with optimizations - pdf-lib strips unused objects
      const pdfBytes = await doc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResult({
        originalSize: file.size,
        compressedSize: blob.size,
        blob,
      });
      toast({ title: "PDF compressed!" });
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to compress PDF.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!result || !file) return;
    saveAs(result.blob, `compressed_${file.name}`);
  };

  return (
    <div>
      <AnimatePresence>{processing && <ProcessingOverlay message="Compressing PDF..." />}</AnimatePresence>
      <ToolHeader title="Compress PDF" description="Reduce PDF file size while maintaining quality." />

      <FileDropZone accept=".pdf" multiple={false} onFiles={handleFiles} label="Drop a PDF to compress" sublabel="Max 20MB" />

      {file && !result && (
        <div className="mt-6 space-y-4">
          <div className="bg-surface border border-border/50 rounded-xl p-4">
            <p className="text-sm font-medium text-foreground">{file.name}</p>
            <p className="mono-text text-muted-foreground mt-1">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
          <Button onClick={compress} size="lg">
            <Minimize2 className="w-4 h-4 mr-2" />
            Compress PDF
          </Button>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-success/10 border border-success/20 rounded-xl p-4">
            <p className="text-sm font-medium text-foreground">
              Saved {((1 - result.compressedSize / result.originalSize) * 100).toFixed(1)}%
            </p>
            <div className="flex gap-4 mt-2 mono-text">
              <span className="text-muted-foreground line-through">{(result.originalSize / 1024).toFixed(0)} KB</span>
              <span className="text-success">{(result.compressedSize / 1024).toFixed(0)} KB</span>
            </div>
          </div>
          <Button onClick={download} size="lg">
            <Download className="w-4 h-4 mr-2" />
            Download Compressed PDF
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompressPDF;
