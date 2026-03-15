import { useCallback, useState, useRef } from "react";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";

interface FileDropZoneProps {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label: string;
  sublabel?: string;
}

const FileDropZone = ({ accept, multiple = true, onFiles, label, sublabel }: FileDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) onFiles(files);
    },
    [onFiles]
  );

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFiles(files);
    e.target.value = "";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`drop-zone cursor-pointer ${isDragging ? "drop-zone-active" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      <Upload className={`w-10 h-10 mx-auto mb-4 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
      <p className="text-sm font-medium text-foreground">{label}</p>
      {sublabel && <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>}
    </motion.div>
  );
};

export default FileDropZone;
