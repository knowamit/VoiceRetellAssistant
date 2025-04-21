export function NotConnected() {
  return (
    <div className="py-6">
      <div className="mx-auto w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-slate-700">Not Connected</h3>
      <p className="text-slate-500 mt-1">Start a call with your voice agent</p>
    </div>
  );
}
