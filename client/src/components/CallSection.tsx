import { useState } from "react";
import { useRetellAPI } from "@/hooks/useRetellAPI";
import { Card, CardContent } from "@/components/ui/card";
import { NotConnected } from "@/components/callstates/NotConnected";
import { Connecting } from "@/components/callstates/Connecting";
import { ActiveCall } from "@/components/callstates/ActiveCall";
import { ErrorState } from "@/components/callstates/ErrorState";
import { VoiceAgentDetails } from "@/components/VoiceAgentDetails";

interface CallSectionProps {
  config: {
    agentId: string;
    apiKey: string;
  };
}

export function CallSection({ config }: CallSectionProps) {
  const { isConnecting, isCallActive, error, startCall, endCall, toggleMute } = useRetellAPI();
  const [isMuted, setIsMuted] = useState(false);

  const handleStartCall = async () => {
    if (!config.agentId || !config.apiKey) {
      return false;
    }
    return await startCall({
      agentId: config.agentId,
      apiKey: config.apiKey,
    });
  };

  const handleEndCall = async () => {
    await endCall();
  };

  const handleToggleMute = async () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    await toggleMute(newMutedState);
  };

  const handleReset = () => {
    // Reset the call interface back to the not connected state
  };

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
        <h3 className="text-lg leading-6 font-semibold text-slate-800">Voice Agent Call</h3>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">Connect with your Retell AI Voice Agent</p>
      </div>
      <CardContent className="px-4 py-5 sm:p-6 flex flex-col items-center">
        {/* STATUS DISPLAY */}
        <div className="mb-6 text-center w-full">
          {!isConnecting && !isCallActive && !error && <NotConnected />}
          {isConnecting && <Connecting />}
          {isCallActive && <ActiveCall />}
          {error && <ErrorState error={error} onReset={handleReset} />}
        </div>
        
        {/* CALL CONTROL BUTTONS */}
        <div className="flex flex-wrap justify-center space-x-4">
          {!isConnecting && !isCallActive && (
            <button 
              onClick={handleStartCall}
              className="call-button flex flex-col items-center justify-center bg-green-100 hover:bg-green-200 text-green-700 rounded-full w-16 h-16 mb-2 focus:outline-none transition transform hover:-translate-y-1 active:translate-y-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-xs mt-1">Call</span>
            </button>
          )}
          
          {isCallActive && (
            <>
              <button 
                onClick={handleEndCall}
                className="call-button flex flex-col items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 rounded-full w-16 h-16 mb-2 focus:outline-none transition transform hover:-translate-y-1 active:translate-y-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m-4 8l-6 6m0 0l-1 1m1-1l1 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs mt-1">End</span>
              </button>
              
              <button 
                onClick={handleToggleMute}
                className={`call-button flex flex-col items-center justify-center rounded-full w-16 h-16 mb-2 focus:outline-none transition transform hover:-translate-y-1 active:translate-y-0 ${
                  isMuted 
                    ? "bg-red-100 hover:bg-red-200 text-red-700" 
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span className="text-xs mt-1">{isMuted ? "Unmute" : "Mute"}</span>
              </button>
            </>
          )}
        </div>
      </CardContent>
      
      <VoiceAgentDetails />
    </Card>
  );
}
