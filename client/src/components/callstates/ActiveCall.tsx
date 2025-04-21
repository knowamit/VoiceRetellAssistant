import { useCallTimer } from "@/hooks/useCallTimer";

export function ActiveCall() {
  const { formatTime } = useCallTimer(true);

  return (
    <div className="py-6">
      <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <div className="audio-wave">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="bar h-3" style={{ animationDelay: `${i * 0.1}s` }}></div>
          ))}
        </div>
      </div>
      <h3 className="text-lg font-medium text-green-700">Call in Progress</h3>
      <p className="text-slate-500 mt-1">Voice agent is active</p>
      <div className="mt-3 text-sm text-slate-500">
        <span id="callDuration">{formatTime()}</span>
      </div>
      <style jsx>{`
        .audio-wave {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
        }
        .audio-wave .bar {
          width: 3px;
          border-radius: 3px;
          background: #4f46e5;
          animation: wave 1.2s ease-in-out infinite;
        }
        @keyframes wave {
          0%, 100% {
            height: 10px;
          }
          50% {
            height: 25px;
          }
        }
      `}</style>
    </div>
  );
}
