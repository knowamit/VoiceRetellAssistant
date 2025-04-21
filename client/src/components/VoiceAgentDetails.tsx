export function VoiceAgentDetails() {
  return (
    <div className="border-t border-slate-200 px-4 py-5 sm:px-6">
      <h4 className="text-sm font-medium text-slate-500 mb-2">VOICE AGENT DETAILS</h4>
      <div className="flex items-center">
        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="ml-4">
          <h4 className="text-lg font-medium text-slate-800">Customer Support Agent</h4>
          <p className="text-sm text-slate-500">Designed to handle product inquiries and support requests</p>
        </div>
        <div className="ml-auto">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
