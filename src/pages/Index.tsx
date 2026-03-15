import { useState } from "react";
import Sidebar, { ToolId } from "@/components/Sidebar";
import StatusTicker from "@/components/StatusTicker";
import HomeView from "@/components/HomeView";
import MergePDF from "@/tools/MergePDF";
import SplitPDF from "@/tools/SplitPDF";
import CompressImage from "@/tools/CompressImage";
import ConvertTool from "@/tools/ConvertTool";
import OCRTool from "@/tools/OCRTool";

const TOOL_COMPONENTS: Record<string, React.ComponentType<any> | null> = {
  merge: MergePDF,
  split: SplitPDF,
  "compress-img": CompressImage,
  convert: ConvertTool,
  ocr: OCRTool,
};

const Index = () => {
  const [activeTool, setActiveTool] = useState<ToolId>("home");

  const ActiveComponent = activeTool !== "home" ? TOOL_COMPONENTS[activeTool] : null;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTool={activeTool} onSelectTool={setActiveTool} />

      <main className="ml-64 pb-12">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {activeTool === "home" ? (
            <HomeView onSelectTool={setActiveTool} />
          ) : ActiveComponent ? (
            <ActiveComponent />
          ) : null}
        </div>
      </main>

      <StatusTicker />
    </div>
  );
};

export default Index;
