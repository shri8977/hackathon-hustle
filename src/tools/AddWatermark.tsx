import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import { AnimatePresence } from "framer-motion";
import { Download, Droplets } from "lucide-react";
import FileDropZone from "@/components/FileDropZone";
import ToolHeader from "@/components/ToolHeader";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const AddWatermark = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState([30]);
  const { toast } = useToast();

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (!f || f.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please upload a PDF.", variant: "destructive" });
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum 20MB.", variant: "destructive" });
      return;
    }
    setFile(f);
  };

  const addWatermark = async () => {
    if (!file || !watermarkText.trim()) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const pages = doc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const fontSize = Math.min(width, height) * 0.08;
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);

        page.drawText(watermarkText, {
          x: (width - textWidth) / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity: opacity[0] / 100,
          rotate: { type: "degrees" as any, angle: -45 },
        });
      }

      const pdfBytes = await doc.save();
      saveAs(new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }), `watermarked_${file.name}`);
      toast({ title: "Watermark added!" });
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to add watermark.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <AnimatePresence>{processing && <ProcessingOverlay message="Adding watermark..." />}</AnimatePresence>
      <ToolHeader title="Add Watermark" description="Add a text watermark to all pages of your PDF." />

      {!file ? (
        <FileDropZone accept=".pdf" multiple={false} onFiles={handleFiles} label="Drop a PDF file" sublabel="Max 20MB" />
      ) : (
        <div className="space-y-4">
          <div className="bg-surface border border-border/50 rounded-xl p-5 space-y-4">
            <p className="text-sm font-medium text-foreground">{file.name}</p>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Watermark Text</label>
              <Input value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} placeholder="Enter watermark text" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Opacity</label>
                <span className="mono-text text-muted-foreground tabular-nums">{opacity[0]}%</span>
              </div>
              <Slider value={opacity} onValueChange={setOpacity} min={5} max={80} step={5} />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setFile(null)}>Change File</Button>
            <Button onClick={addWatermark} size="lg">
              <Droplets className="w-4 h-4 mr-2" />
              Add Watermark & Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddWatermark;
