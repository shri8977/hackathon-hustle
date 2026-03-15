import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { AnimatePresence } from "framer-motion";
import { Download, ArrowRight } from "lucide-react";
import FileDropZone from "@/components/FileDropZone";
import ToolHeader from "@/components/ToolHeader";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { Button } from "@/components/ui/button";

type ConvertMode = "img-to-pdf" | "pdf-to-img";

const ConvertTool = () => {
  const [mode, setMode] = useState<ConvertMode>("img-to-pdf");
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFiles = (newFiles: File[]) => setFiles((prev) => [...prev, ...newFiles]);

  const convertImgToPdf = async () => {
    if (!files.length) return;
    setProcessing(true);
    try {
      const doc = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        let image;
        if (file.type === "image/png") {
          image = await doc.embedPng(bytes);
        } else {
          image = await doc.embedJpg(bytes);
        }
        const page = doc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const pdfBytes = await doc.save();
      saveAs(new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }), "converted.pdf");
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const convertPdfToImg = async () => {
    if (!files.length) return;
    setProcessing(true);
    try {
      // Use canvas-based rendering for PDF to image
      // For hackathon, we'll use a simplified approach
      const file = files[0];
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const pageCount = doc.getPageCount();

      // Create individual PDFs for each page (as downloadable files)
      const zip = new JSZip();
      for (let i = 0; i < pageCount; i++) {
        const newDoc = await PDFDocument.create();
        const [page] = await newDoc.copyPages(doc, [i]);
        newDoc.addPage(page);
        const pageBytes = await newDoc.save();
        zip.file(`page_${i + 1}.pdf`, pageBytes);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "pdf_pages.zip");
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <AnimatePresence>{processing && <ProcessingOverlay message="Converting..." />}</AnimatePresence>
      <ToolHeader title="Convert" description="Convert between image and PDF formats." />

      <div className="flex gap-2 mb-6">
        {([
          { id: "img-to-pdf" as ConvertMode, label: "Images → PDF" },
          { id: "pdf-to-img" as ConvertMode, label: "PDF → Pages" },
        ]).map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setFiles([]); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m.id
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-muted-foreground hover:text-foreground border border-border/50"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <FileDropZone
        accept={mode === "img-to-pdf" ? "image/png,image/jpeg,image/jpg" : ".pdf"}
        multiple={mode === "img-to-pdf"}
        onFiles={handleFiles}
        label={mode === "img-to-pdf" ? "Drop images to convert to PDF" : "Drop a PDF to split into pages"}
        sublabel="No file size limits"
      />

      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="bg-surface border border-border/50 rounded-xl p-4">
            <p className="text-sm text-foreground font-medium">{files.length} file(s) ready</p>
            <div className="flex items-center gap-2 mt-1 mono-text text-muted-foreground">
              <span>{mode === "img-to-pdf" ? "Images" : "PDF"}</span>
              <ArrowRight className="w-3 h-3" />
              <span>{mode === "img-to-pdf" ? "PDF" : "Individual Pages"}</span>
            </div>
          </div>
          <Button onClick={mode === "img-to-pdf" ? convertImgToPdf : convertPdfToImg} size="lg">
            <Download className="w-4 h-4 mr-2" />
            Convert & Download
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConvertTool;
