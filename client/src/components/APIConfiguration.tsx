import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface APIConfigurationProps {
  onConfigUpdate: (config: { agentId: string; apiKey: string }) => void;
}

export function APIConfiguration({ onConfigUpdate }: APIConfigurationProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [agentId, setAgentId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSaveConfig = () => {
    if (!agentId) {
      toast({
        title: "Missing Agent ID",
        description: "Please enter your Retell Agent ID",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "Missing API Key",
        description: "Please enter your Retell API Key",
        variant: "destructive",
      });
      return;
    }

    onConfigUpdate({ agentId, apiKey });
    
    toast({
      title: "Configuration Saved",
      description: "Your Retell API configuration has been saved",
    });
  };

  return (
    <Card className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
        <h3 className="text-lg leading-6 font-semibold text-slate-800">API Configuration</h3>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">Configure your Retell AI integration</p>
      </div>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="agentID" className="block text-sm font-medium text-slate-700">
              Agent ID
            </Label>
            <div className="mt-1">
              <Input
                type="text"
                id="agentID"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                placeholder="agent_xxxxxxxxxxxxxxxx"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-slate-300 rounded-md"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="apiKey" className="block text-sm font-medium text-slate-700">
              Environment API Key
            </Label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <Input
                type={showApiKey ? "text" : "password"}
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="••••••••••••••••••••"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-slate-300 rounded-md pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button 
                  type="button" 
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  {showApiKey ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleSaveConfig}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
