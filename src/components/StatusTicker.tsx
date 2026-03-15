import { useEffect, useState } from "react";

const MESSAGES = [
  "System initialized",
  "All tools operational",
  "PDF engine ready",
  "Image processor loaded",
  "OCR module standing by",
  "No file size limits active",
  "Client-side processing enabled",
  "Zero data sent to servers",
  "Ready for input",
];

const StatusTicker = () => {
  const [logs, setLogs] = useState<{ time: string; msg: string }[]>([]);

  useEffect(() => {
    const now = () => {
      const d = new Date();
      return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
    };

    // Initial burst
    const initial = MESSAGES.slice(0, 3).map((msg, i) => ({
      time: now(),
      msg,
    }));
    setLogs(initial);

    let idx = 3;
    const interval = setInterval(() => {
      if (idx < MESSAGES.length) {
        setLogs((prev) => [...prev.slice(-4), { time: now(), msg: MESSAGES[idx] }]);
        idx++;
      } else {
        idx = 0;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-foreground/[0.03] border-t border-border/50 flex items-center px-4 overflow-hidden z-50">
      <div className="flex gap-6 mono-text text-muted-foreground">
        {logs.map((log, i) => (
          <span key={i} className="whitespace-nowrap">
            <span className="text-primary">[{log.time}]</span> {log.msg}
          </span>
        ))}
      </div>
    </div>
  );
};

export default StatusTicker;
