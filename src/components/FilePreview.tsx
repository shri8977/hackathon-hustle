import { FileText, Image as ImageIcon, Music, Video, File } from "lucide-react";
import { formatFileSize } from "@/lib/file-utils";

interface FilePreviewProps {
  file: File;
}

const FilePreview = ({ file }: FilePreviewProps) => {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const isAudio = file.type.startsWith("audio/");
  const isPDF = file.type === "application/pdf";

  return (
    <div className="bg-surface border border-border/50 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        {isPDF && <FileText className="w-5 h-5 text-primary" />}
        {isImage && <ImageIcon className="w-5 h-5 text-primary" />}
        {isVideo && <Video className="w-5 h-5 text-primary" />}
        {isAudio && <Music className="w-5 h-5 text-primary" />}
        {!isPDF && !isImage && !isVideo && !isAudio && <File className="w-5 h-5 text-muted-foreground" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
          <p className="mono-text text-muted-foreground">{formatFileSize(file.size)}</p>
        </div>
      </div>

      {isImage && (
        <img src={URL.createObjectURL(file)} alt={file.name} className="max-h-48 rounded-lg object-contain mx-auto" />
      )}

      {isVideo && (
        <video controls className="max-h-48 rounded-lg mx-auto w-full">
          <source src={URL.createObjectURL(file)} type={file.type} />
        </video>
      )}

      {isAudio && (
        <audio controls className="w-full">
          <source src={URL.createObjectURL(file)} type={file.type} />
        </audio>
      )}

      {isPDF && (
        <div className="bg-muted rounded-lg p-6 text-center">
          <FileText className="w-10 h-10 text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">PDF Document</p>
        </div>
      )}

      {!isPDF && !isImage && !isVideo && !isAudio && (
        <div className="bg-muted rounded-lg p-6 text-center">
          <File className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">{file.type || "Unknown format"}</p>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
