import { CallHistory } from "@/components/CallHistory";
import { APIConfiguration } from "@/components/APIConfiguration";

interface SidePanelProps {
  onConfigUpdate: (config: { agentId: string; apiKey: string }) => void;
}

export function SidePanel({ onConfigUpdate }: SidePanelProps) {
  return (
    <div className="space-y-6">
      <CallHistory />
      <APIConfiguration onConfigUpdate={onConfigUpdate} />
    </div>
  );
}
