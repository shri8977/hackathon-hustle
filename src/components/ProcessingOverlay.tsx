import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ProcessingOverlayProps {
  message: string;
  progress?: number;
}

const ProcessingOverlay = ({ message, progress }: ProcessingOverlayProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
  >
    <div className="tool-card text-center max-w-sm">
      <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
      <p className="text-sm font-medium text-foreground">{message}</p>
      {progress !== undefined && (
        <div className="mt-4 w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </div>
  </motion.div>
);

export default ProcessingOverlay;
