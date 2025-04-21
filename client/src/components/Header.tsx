import { Link } from "wouter";
import { Mic } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Mic className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-semibold text-slate-800">VoiceConnect</span>
            </div>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/">
                <a className="border-primary-600 text-slate-700 border-b-2 px-1 pt-1 text-sm font-medium">
                  Dashboard
                </a>
              </Link>
              <Link href="/settings">
                <a className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 border-b-2 px-1 pt-1 text-sm font-medium">
                  Settings
                </a>
              </Link>
            </nav>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <button className="bg-white p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none">
              <span className="sr-only">View notifications</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="ml-3 relative">
              <div>
                <button className="bg-white rounded-full flex text-sm focus:outline-none">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                    JD
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button className="bg-white p-2 rounded-md text-slate-400 hover:text-slate-500 focus:outline-none">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
