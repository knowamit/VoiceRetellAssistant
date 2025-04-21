import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface RetellConfig {
  agentId: string;
  apiKey: string;
}

interface CallSession {
  id: string;
  status: "created" | "ongoing" | "ended" | "error";
  createdAt: string;
  endedAt?: string;
}

export function useRetellAPI() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const { toast } = useToast();

  const startCall = async (config: RetellConfig) => {
    try {
      setIsConnecting(true);
      setError(null);

      const response = await apiRequest("POST", "/api/calls", {
        agentId: config.agentId,
        apiKey: config.apiKey,
      });

      const data = await response.json();
      setCurrentCallId(data.callId);
      setIsCallActive(true);
      setIsConnecting(false);
      
      return true;
    } catch (err) {
      setIsConnecting(false);
      const message = err instanceof Error ? err.message : "Failed to start call";
      setError(message);
      toast({
        title: "Call Error",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const endCall = async () => {
    if (!currentCallId) return;
    
    try {
      await apiRequest("POST", `/api/calls/${currentCallId}/end`, {});
      setIsCallActive(false);
      setCurrentCallId(null);
      toast({
        title: "Call Ended",
        description: "Your call has been successfully ended",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to end call";
      toast({
        title: "Error Ending Call",
        description: message,
        variant: "destructive",
      });
    }
  };

  const toggleMute = async (muted: boolean) => {
    if (!currentCallId) return;
    
    try {
      await apiRequest("POST", `/api/calls/${currentCallId}/mute`, { muted });
      toast({
        title: muted ? "Microphone Muted" : "Microphone Unmuted",
        description: muted ? "You are now muted" : "You are now unmuted",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to toggle mute";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  return {
    isConnecting,
    isCallActive,
    error,
    startCall,
    endCall,
    toggleMute,
  };
}
