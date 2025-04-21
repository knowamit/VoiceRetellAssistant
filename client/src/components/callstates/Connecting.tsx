export function Connecting() {
  return (
    <div className="py-6">
      <div className="mx-auto w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-4 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-slate-700">Connecting...</h3>
      <p className="text-slate-500 mt-1">Establishing connection with voice agent</p>
    </div>
  );
}
