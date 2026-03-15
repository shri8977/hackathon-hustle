import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { AnimatePresence } from "framer-motion";
import { Download, Scissors } from "lucide-react";
import FileDropZone from "@/components/FileDropZone";
import ToolHeader from "@/components/ToolHeader";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SplitPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rangeInput, setRangeInput] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleFiles = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    const bytes = await f.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    const count = doc.getPageCount();
    setPageCount(count);
    setRangeInput(`1-${count}`);
  };

  const split = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes);

      // Parse ranges like "1-3, 5, 7-9"
      const ranges = rangeInput.split(",").map((r) => r.trim());
      const zip = new JSZip();

      for (let ri = 0; ri < ranges.length; ri++) {
        const range = ranges[ri];
        const newDoc = await PDFDocument.create();
        const match = range.match(/^(\d+)(?:-(\d+))?$/);
        if (!match) continue;

        const start = parseInt(match[1]) - 1;
        const end = match[2] ? parseInt(match[2]) - 1 : start;

        const indices = [];
        for (let i = start; i <= end && i < srcDoc.getPageCount(); i++) {
          indices.push(i);
        }

        const pages = await newDoc.copyPages(srcDoc, indices);
        pages.forEach((p) => newDoc.addPage(p));
        const pdfBytes = await newDoc.save();
        zip.file(`split_${ri + 1}_pages_${range}.pdf`, pdfBytes);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "split_pdfs.zip");
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <AnimatePresence>{processing && <ProcessingOverlay message="Splitting PDF..." />}</AnimatePresence>
      <ToolHeader title="Split PDF" description="Extract specific pages or split a PDF into multiple files." />

      {!file ? (
        <FileDropZone
          accept=".pdf"
          multiple={false}
          onFiles={handleFiles}
          label="Drop a PDF file here"
          sublabel="Select pages to extract after upload"
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-surface border border-border/50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-foreground">{file.name}</p>
                <p className="mono-text text-muted-foreground mt-1">{pageCount} pages · {(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setFile(null); setPageCount(0); }}>
                Change File
              </Button>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Page Range</label>
              <Input
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="e.g. 1-3, 5, 7-9"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Separate ranges with commas. Each range creates a separate PDF file.
              </p>
            </div>
          </div>

          <Button onClick={split} size="lg">
            <Scissors className="w-4 h-4 mr-2" />
            Split & Download
          </Button>
        </div>
      )}
    </div>
  );
};

export default SplitPDF;
