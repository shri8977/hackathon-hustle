import { useState, useEffect } from "react";
import { 
  FileText, Image, ScanText, Scissors, Combine, Minimize2, FileOutput, Home, 
  Sparkles, Languages, HelpCircle, Droplets, LogOut, X, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import ProfileDialog from "./ProfileDialog";

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
  beta?: boolean;
}

export const TOOLS: Tool[] = [
  { id: "home", label: "Home", icon: Home, category: "", description: "" },
  { id: "ai-summarize", label: "AI Summarize", icon: Sparkles, category: "AI Tools", description: "Summarize documents with AI" },
  { id: "ai-translate", label: "AI Translate", icon: Languages, category: "AI Tools", description: "Translate text to any language" },
  { id: "ai-questions", label: "Question Generator", icon: HelpCircle, category: "AI Tools", description: "Generate study questions" },
  { id: "ocr", label: "OCR Extract Text", icon: ScanText, category: "AI Tools", description: "Extract text from images" },
  { id: "merge", label: "Merge PDF", icon: Combine, category: "Organize", description: "Combine multiple PDFs" },
  { id: "split", label: "Split PDF", icon: Scissors, category: "Organize", description: "Split PDF into parts" },
  { id: "compress-pdf", label: "Compress PDF", icon: Minimize2, category: "Organize", description: "Reduce PDF file size" },
  { id: "add-watermark", label: "Add Watermark", icon: Droplets, category: "Editing", description: "Stamp watermark on PDF" },
  { id: "convert", label: "Convert", icon: FileOutput, category: "Convert", description: "Convert between formats", beta: true },
  { id: "compress-img", label: "Compress Image", icon: Image, category: "Convert", description: "Reduce image file size" },
];

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

interface SidebarProps {
  activeTool: ToolId;
  onSelectTool: (id: ToolId) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const SidebarContent = ({ activeTool, onSelectTool }: { activeTool: ToolId; onSelectTool: (id: ToolId) => void }) => {
  const { user, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);
  let lastCategory = "";

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single()
        .then(({ data }) => setProfile(data));
    }
  }, [user, profileOpen]);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || "User";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
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
                {tool.beta && (
                  <Badge variant="outline" className="ml-auto text-[9px] px-1.5 py-0 h-4 border-primary/40 text-primary font-semibold">
                    BETA
                  </Badge>
                )}
                {activeTool === tool.id && !tool.beta && (
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

      <div className="p-4 border-t border-border/50 space-y-3">
        {user && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 min-w-0 group"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-transparent group-hover:ring-primary/30 transition-all">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-semibold text-primary">{initial}</span>
                )}
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="text-xs font-medium text-foreground truncate max-w-[120px]">
                  {displayName}
                </span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                  {user.email}
                </span>
              </div>
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setProfileOpen(true)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                title="Edit Profile"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={signOut}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
        <div>
          <p className="mono-text text-muted-foreground">AI-Powered • Max 20MB</p>
          <p className="mono-text text-muted-foreground">Files processed in memory</p>
        </div>
      </div>

      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
};

const Sidebar = ({ activeTool, onSelectTool, isOpen = false, onClose }: SidebarProps) => {
  const handleSelect = (id: ToolId) => {
    onSelectTool(id);
    onClose?.();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 h-screen fixed left-0 top-0 bg-surface border-r border-border/50 flex-col z-40">
        <div className="h-16 flex items-center justify-between px-5 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-base tracking-tight">DocFlow AI</span>
          </div>
          <ThemeToggle />
        </div>
        <SidebarContent activeTool={activeTool} onSelectTool={onSelectTool} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/60 z-40"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden fixed left-0 top-0 w-72 h-screen bg-surface border-r border-border/50 flex flex-col z-50"
            >
              <div className="h-16 flex items-center justify-between px-5 border-b border-border/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-semibold text-foreground text-base tracking-tight">DocFlow AI</span>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent activeTool={activeTool} onSelectTool={handleSelect} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
