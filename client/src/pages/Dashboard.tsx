import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CallSection } from "@/components/CallSection";
import { SidePanel } from "@/components/SidePanel";
import { useState } from "react";

interface ApiConfig {
  agentId: string;
  apiKey: string;
}

export default function Dashboard() {
  const [config, setConfig] = useState<ApiConfig>({
    agentId: "",
    apiKey: "",
  });

  const handleConfigUpdate = (newConfig: ApiConfig) => {
    setConfig(newConfig);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CallSection config={config} />
          </div>
          <div className="lg:col-span-1">
            <SidePanel onConfigUpdate={handleConfigUpdate} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
