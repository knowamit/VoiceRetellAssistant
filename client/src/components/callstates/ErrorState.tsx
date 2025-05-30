interface ErrorStateProps {
  error: string;
  onReset: () => void;
}

export function ErrorState({ error, onReset }: ErrorStateProps) {
  return (
    <div className="py-6">
      <div className="mx-auto w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-red-700">Connection Error</h3>
      <p className="text-slate-500 mt-1">{error || "Unable to connect to voice agent"}</p>
      <button 
        className="mt-4 text-primary-600 font-medium focus:outline-none hover:text-primary-700"
        onClick={onReset}
      >
        Try Again
      </button>
    </div>
  );
}
