import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`bg-white border-b border-gray-100 sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}
        id="main-header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer group">
              <span className="font-bold text-2xl tracking-tight text-gray-900 group-hover:opacity-90 transition-opacity">
                <span className="text-blue-600">US</span>CalcHub
              </span>
            </Link>

            <nav className="hidden md:flex gap-6 items-center">
              <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium">Home</Link>
              <Link href="/#tools-section" className="text-slate-600 hover:text-blue-600 font-medium">Finance Tools</Link>
              <Link href="/contact/" className="text-slate-600 hover:text-blue-600 font-medium">Contact</Link>
              <a href="https://uscalchub.com/blog/" className="text-slate-600 hover:text-blue-600 font-medium">Blog</a>
              <Link href="/about/" className="text-slate-600 hover:text-blue-600 font-medium">About Us</Link>
            </nav>

            <div className="md:hidden flex items-center">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-blue-600 focus:outline-none p-2 rounded-md transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-lg absolute w-full z-40">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/#tools-section" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors">Finance Tools</Link>
            <Link href="/contact/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors">Contact</Link>
            <a href="https://uscalchub.com/blog/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors">Blog</a>
            <Link href="/about/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors">About Us</Link>
          </div>
        )}
      </header>
    </>
  );
}
