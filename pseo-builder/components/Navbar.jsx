import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="h-[52px] bg-white border-b border-slate-200 sticky top-0 z-50 px-6">
      <div className="max-w-3xl mx-auto h-full flex justify-between items-center">
        {/* Left side: Logo */}
        <Link href="/" className="text-[15px] font-medium text-slate-900 tracking-tight flex items-center">
          <span>US</span>
          <span className="text-blue-600">Calc</span>
          <span>Hub</span>
        </Link>

        {/* Right side: Links & CTA */}
        <div className="flex gap-[14px] items-center">
          {/* Unified Site-Wide Search Trigger */}
          <button
            type="button"
            data-open-search
            onClick={() => {
              if (typeof window !== 'undefined' && window.openUSCalcHubSearch) {
                window.openUSCalcHubSearch();
              }
            }}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-900 text-[12px] font-medium px-2.5 py-1 rounded-full border border-slate-200 transition-all focus:outline-none cursor-pointer"
            title="Search 80+ calculators, tools & articles (⌘K)"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline text-[9px] bg-white border border-slate-200 px-1 rounded text-slate-400 font-mono">⌘K</kbd>
          </button>

          <Link href="/" className="text-[12px] text-slate-500 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link 
            href="/salary-calculator/" 
            className={`text-[12px] transition-colors ${
              router.pathname.startsWith('/salary-calculator') 
                ? 'text-blue-600 font-medium' 
                : 'text-slate-500 hover:text-blue-600'
            }`}
          >
            Finance Tools
          </Link>
          <a href="https://uscalchub.com/blog/" className="text-[12px] text-slate-500 hover:text-blue-600 transition-colors hidden sm:block">
            Blog
          </a>
          <Link href="/about/" className="text-[12px] text-slate-500 hover:text-blue-600 transition-colors hidden sm:block">
            About Us
          </Link>
          <Link href="/#tools-section" className="bg-blue-600 text-white text-[12px] font-medium px-[14px] py-[5px] rounded-full hover:bg-blue-700 transition-colors border-none ml-1">
            Free Tools
          </Link>
        </div>
      </div>
    </nav>
  );
}
