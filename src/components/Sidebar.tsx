import { FileText, Image, ScanText, Scissors, Combine, Minimize2, FileOutput, Home } from "lucide-react";
import { motion } from "framer-motion";

export type ToolId = "home" | "merge" | "split" | "compress-pdf" | "compress-img" | "convert" | "ocr";

interface Tool {
  id: ToolId;
  label: string;
  icon: React.ElementType;
  category: string;
}

export const TOOLS: Tool[] = [
  { id: "home", label: "Home", icon: Home, category: "" },
  { id: "merge", label: "Merge PDF", icon: Combine, category: "PDF" },
  { id: "split", label: "Split PDF", icon: Scissors, category: "PDF" },
  { id: "compress-img", label: "Compress Image", icon: Minimize2, category: "Image" },
  { id: "convert", label: "Convert", icon: FileOutput, category: "Convert" },
  { id: "ocr", label: "Extract Text", icon: ScanText, category: "AI" },
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
      <div className="h-16 flex items-center px-5 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground text-base tracking-tight">DocForge</span>
        </div>
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
        <p className="mono-text text-muted-foreground">100% Client-Side</p>
        <p className="mono-text text-muted-foreground">No file size limits</p>
      </div>
    </aside>
  );
};

export default Sidebar;
