import { 
  FileText, Image, ScanText, Scissors, Combine, Minimize2, FileOutput, Home, 
  Sparkles, Languages, HelpCircle, Droplets, FileDown
} from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

export type ToolId = 
  | "home" 
  | "merge" | "split" | "compress-pdf" | "compress-img" | "convert"
  | "ocr" | "ai-summarize" | "ai-translate" | "ai-questions"
  | "add-watermark";

interface Tool {
  id: ToolId;
  label: string;
  icon: React.ElementType;
  category: string;
  description: string;
}

export const TOOLS: Tool[] = [
  { id: "home", label: "Home", icon: Home, category: "", description: "" },
  // AI Tools
  { id: "ai-summarize", label: "AI Summarize", icon: Sparkles, category: "AI Tools", description: "Summarize documents with AI" },
  { id: "ai-translate", label: "AI Translate", icon: Languages, category: "AI Tools", description: "Translate text to any language" },
  { id: "ai-questions", label: "Question Generator", icon: HelpCircle, category: "AI Tools", description: "Generate study questions" },
  { id: "ocr", label: "OCR Extract Text", icon: ScanText, category: "AI Tools", description: "Extract text from images" },
  // PDF Tools
  { id: "merge", label: "Merge PDF", icon: Combine, category: "Organize", description: "Combine multiple PDFs" },
  { id: "split", label: "Split PDF", icon: Scissors, category: "Organize", description: "Split PDF into parts" },
  { id: "compress-pdf", label: "Compress PDF", icon: Minimize2, category: "Organize", description: "Reduce PDF file size" },
  // Editing
  { id: "add-watermark", label: "Add Watermark", icon: Droplets, category: "Editing", description: "Stamp watermark on PDF" },
  // Convert
  { id: "convert", label: "Convert", icon: FileOutput, category: "Convert", description: "Convert between formats" },
  { id: "compress-img", label: "Compress Image", icon: Image, category: "Convert", description: "Reduce image file size" },
];

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

interface SidebarProps {
  activeTool: ToolId;
  onSelectTool: (id: ToolId) => void;
}

const Sidebar = ({ activeTool, onSelectTool }: SidebarProps) => {
  let lastCategory = "";

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-surface border-r border-border/50 flex flex-col z-40">
      <div className="h-16 flex items-center justify-between px-5 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground text-base tracking-tight">DocFlow AI</span>
        </div>
        <ThemeToggle />
      </div>

      <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        {TOOLS.map((tool) => {
          const showCategory = tool.category && tool.category !== lastCategory;
          if (tool.category) lastCategory = tool.category;

          return (
            <div key={tool.id}>
              {showCategory && (
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide px-3 pt-4 pb-1.5">
                  {tool.category}
                </p>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={spring}
                onClick={() => onSelectTool(tool.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-100 ${
                  activeTool === tool.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <tool.icon className="w-4 h-4" />
                {tool.label}
                {activeTool === tool.id && (
                  <motion.div
                    layoutId="active-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                    transition={spring}
                  />
                )}
              </motion.button>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <p className="mono-text text-muted-foreground">AI-Powered • Max 20MB</p>
        <p className="mono-text text-muted-foreground">Files processed in memory</p>
      </div>
    </aside>
  );
};

export default Sidebar;
