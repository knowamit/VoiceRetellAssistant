export function Footer() {
  return (
    <footer className="bg-white mt-8">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} VoiceConnect. All rights reserved.
          </div>
          <div className="text-sm text-slate-500">
            Powered by <a href="https://www.raisingsuperstars.com/" className="text-primary-600 hover:text-primary-700">RaisingSupers</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
