import { motion } from "framer-motion";
import { TOOLS, ToolId } from "./Sidebar";
import { Zap, Shield, Infinity } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

interface HomeViewProps {
  onSelectTool: (id: ToolId) => void;
}

const FEATURES = [
  { icon: Zap, title: "Instant Processing", desc: "All tools run client-side for maximum speed" },
  { icon: Shield, title: "100% Private", desc: "Your files never leave your browser" },
  { icon: Infinity, title: "No Limits", desc: "No file size caps, no daily usage limits, no subscriptions" },
];

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
          Instant Document Tools
          <br />
          <span className="text-primary">for Everyone.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.02 }}
          className="text-base text-muted-foreground mt-4 max-w-lg"
        >
          Free, unrestricted document and media utility platform. No sign-ups, no file limits, no data collection.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {tools.map((tool, i) => (
          <motion.button
            key={tool.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.02 + i * 0.02 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectTool(tool.id)}
            className="tool-card text-left"
          >
            <tool.icon className="w-5 h-5 text-primary mb-3" />
            <p className="text-sm font-semibold text-foreground">{tool.label}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {tool.category} tool — no limits
            </p>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
