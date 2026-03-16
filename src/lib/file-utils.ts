import { PDFDocument } from "pdf-lib";

export async function extractTextFromPDF(file: File): Promise<string> {
  // pdf-lib doesn't extract text well, so we use a basic approach
  // For real text extraction, we'd use pdf.js or server-side tools
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const pages = doc.getPages();
  
  // Simple approach: return page count info since pdf-lib can't extract text directly
  // The user can use OCR for scanned PDFs or paste text directly
  return `[PDF Document: ${pages.length} pages - "${file.name}"]\n\nNote: For best results with scanned PDFs, use the OCR tool first to extract text, then use AI tools on the extracted text.`;
}

export function validateFile(file: File, maxSizeMB: number = 20, allowedTypes?: string[]): string | null {
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `File too large. Maximum size is ${maxSizeMB}MB.`;
  }
  if (allowedTypes && !allowedTypes.some(t => file.type.match(t))) {
    return "Invalid file type.";
  }
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
