import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="h-[52px] bg-white border-b border-slate-200 sticky top-0 z-50 px-6">
      <div className="max-w-5xl mx-auto h-full flex justify-between items-center">
        {/* Left side: Logo */}
        <Link href="/" className="text-[15px] font-medium text-slate-900 tracking-tight flex items-center">
          <span>US</span>
          <span className="text-blue-600">Calc</span>
          <span>Hub</span>
        </Link>

        {/* Right side: Links & CTA */}
        <div className="flex gap-[18px] items-center">
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
          <Link href="/#tools-section" className="bg-blue-600 text-white text-[12px] font-medium px-[14px] py-[5px] rounded-full hover:bg-blue-700 transition-colors border-none ml-2">
            Free Tools
          </Link>
        </div>
      </div>
    </nav>
  );
}
