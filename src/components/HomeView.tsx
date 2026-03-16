import { motion } from "framer-motion";
import { TOOLS, ToolId } from "./Sidebar";
import { Zap, Shield, Brain } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

interface HomeViewProps {
  onSelectTool: (id: ToolId) => void;
}

const FEATURES = [
  { icon: Brain, title: "AI-Powered", desc: "Summarize, translate, and generate questions with AI" },
  { icon: Zap, title: "Instant Processing", desc: "PDF tools run client-side for maximum speed" },
  { icon: Shield, title: "Secure & Private", desc: "Files processed in memory, never permanently stored" },
];

const CATEGORIES = ["AI Tools", "Organize", "Editing", "Convert"];

const HomeView = ({ onSelectTool }: HomeViewProps) => {
  const tools = TOOLS.filter((t) => t.id !== "home");

  return (
    <div>
      <div className="mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0 }}
          className="text-4xl md:text-5xl font-bold text-foreground tracking-tight"
        >
          AI-Powered Document
          <br />
          <span className="text-primary">Tools for Everyone.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.02 }}
          className="text-base text-muted-foreground mt-4 max-w-lg"
        >
          Summarize, translate, merge, split, compress, and convert documents — all powered by AI and processed securely.
        </motion.p>
      </div>

      {CATEGORIES.map((category, ci) => {
        const categoryTools = tools.filter((t) => t.category === category);
        if (!categoryTools.length) return null;

        return (
          <div key={category} className="mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.02 + ci * 0.02 }}
              className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3"
            >
              {category}
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTools.map((tool, i) => (
                <motion.button
                  key={tool.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: 0.04 + ci * 0.02 + i * 0.02 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectTool(tool.id)}
                  className="tool-card text-left"
                >
                  <tool.icon className="w-5 h-5 text-primary mb-3" />
                  <p className="text-sm font-semibold text-foreground">{tool.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                </motion.button>
              ))}
            </div>
          </div>
        );
      })}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 + i * 0.02 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border/50"
          >
            <f.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">{f.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomeView;
