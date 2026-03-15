import { useState } from "react";
import imageCompression from "browser-image-compression";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Image as ImageIcon } from "lucide-react";
import FileDropZone from "@/components/FileDropZone";
import ToolHeader from "@/components/ToolHeader";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface CompressedFile {
  original: File;
  compressed: Blob;
  originalSize: number;
  compressedSize: number;
}

const CompressImage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState([80]);
  const [results, setResults] = useState<CompressedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFiles = (newFiles: File[]) => {
    const images = newFiles.filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...images]);
    setResults([]);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setResults([]);
  };

  const compress = async () => {
    if (!files.length) return;
    setProcessing(true);
    setProgress(0);
    const compressed: CompressedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await imageCompression(file, {
          maxSizeMB: (quality[0] / 100) * (file.size / (1024 * 1024)) || 0.5,
          maxWidthOrHeight: 4096,
          useWebWorker: true,
          initialQuality: quality[0] / 100,
        });
        compressed.push({
          original: file,
          compressed: result,
          originalSize: file.size,
          compressedSize: result.size,
        });
      } catch {
        compressed.push({
          original: file,
          compressed: file,
          originalSize: file.size,
          compressedSize: file.size,
        });
      }
      setProgress(((i + 1) / files.length) * 100);
    }

    setResults(compressed);
    setProcessing(false);
  };

  const downloadAll = async () => {
    if (results.length === 1) {
      saveAs(results[0].compressed, `compressed_${results[0].original.name}`);
      return;
    }
    const zip = new JSZip();
    results.forEach((r) => zip.file(`compressed_${r.original.name}`, r.compressed));
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "compressed_images.zip");
  };

  const totalSaved = results.reduce((acc, r) => acc + (r.originalSize - r.compressedSize), 0);

  return (
    <div>
      <AnimatePresence>
        {processing && <ProcessingOverlay message="Compressing images..." progress={progress} />}
      </AnimatePresence>
      <ToolHeader title="Compress Image" description="Reduce image file size while maintaining visual quality." />

      <FileDropZone
        accept="image/*"
        onFiles={handleFiles}
        label="Drop images here or click to browse"
        sublabel="Supports JPG, PNG, WebP — no file size limits"
      />

      {files.length > 0 && !results.length && (
        <div className="mt-6 space-y-4">
          {files.map((file, i) => (
            <motion.div
              key={`${file.name}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-center gap-3 bg-surface border border-border/50 rounded-lg px-4 py-3"
            >
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground flex-1 truncate">{file.name}</span>
              <span className="mono-text text-muted-foreground tabular-nums">
                {(file.size / 1024).toFixed(0)} KB
              </span>
              <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}

          <div className="bg-surface border border-border/50 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Quality</label>
              <span className="mono-text text-muted-foreground tabular-nums">{quality[0]}%</span>
            </div>
            <Slider value={quality} onValueChange={setQuality} min={10} max={100} step={5} />
          </div>

          <Button onClick={compress} size="lg">
            Compress {files.length} {files.length === 1 ? "Image" : "Images"}
          </Button>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="bg-success/10 border border-success/20 rounded-xl p-4">
            <p className="text-sm font-medium text-foreground">
              Saved {(totalSaved / 1024).toFixed(0)} KB total
            </p>
          </div>

          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-3 bg-surface border border-border/50 rounded-lg px-4 py-3">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground flex-1 truncate">{r.original.name}</span>
              <span className="mono-text text-muted-foreground tabular-nums line-through">
                {(r.originalSize / 1024).toFixed(0)} KB
              </span>
              <span className="mono-text text-success tabular-nums">
                {(r.compressedSize / 1024).toFixed(0)} KB
              </span>
            </div>
          ))}

          <Button onClick={downloadAll} size="lg">
            <Download className="w-4 h-4 mr-2" />
            Download All
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompressImage;
