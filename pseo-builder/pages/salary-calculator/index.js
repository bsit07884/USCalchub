import Head from 'next/head';
import Link from 'next/link';
import { TAX_DATA, SALARY_CONFIG, calculateTakeHome } from '../../lib/taxData';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function SalaryCalculatorHub() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
      <Head>
        <title>Salary After Tax Calculator by State 2026 | USCalcHub</title>
        <meta name="description" content="Free salary after-tax calculator for all 50 US states. See exact take-home pay for $60k, $75k, $100k and any salary in Texas, Florida, California, New York — updated for 2026." />
        <link rel="canonical" href="https://uscalchub.com/salary-calculator/" />
      </Head>

      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-12 flex-grow w-full">
        
        {/* Modern Hero Section */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center mb-12 shadow-xl relative overflow-hidden">
          {/* Background Decorative Graphic */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
               <path d="M400 0H0V400H400V0Z" fill="url(#paint0_linear)"/>
               <defs>
                 <linearGradient id="paint0_linear" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
                   <stop stopColor="#3B82F6"/>
                   <stop offset="1" stopColor="#1E3A8A"/>
                 </linearGradient>
               </defs>
             </svg>
          </div>

          <div className="relative z-10">
            <span className="text-blue-400 font-bold tracking-widest uppercase text-xs mb-3 block">2026 Tax Update</span>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              State-by-State Salary Calculator
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Select your state and income bracket below to see an instant, data-backed breakdown of your exact take-home pay after federal, FICA, and state taxes.
            </p>
          </div>
        </div>

        {/* State Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.values(TAX_DATA).map(state => (
            <div key={state.slug} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300 group">
              
              {/* Card Header */}
              <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">{state.flag}</span>
                  {state.name}
                </h2>
                {state.stateTaxRate === 0 && (
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold shadow-sm">
                    0% State Tax
                  </span>
                )}
              </div>

              {/* Salary Links Grid */}
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(SALARY_CONFIG).map(([key, config]) => {
                  const calc = calculateTakeHome(config.amount, state.slug);
                  return (
                    <Link key={key} href={`/salary-calculator/${state.slug}/${key}/`} className="block text-center bg-slate-50 border border-slate-200 rounded-xl p-3 hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200">
                      <p className="font-bold text-slate-800 text-sm md:text-base">
                        {config.display}
                      </p>
                      <p className="text-green-600 font-bold mt-1 text-sm">
                        ${(calc?.annualTakeHome / 1000).toFixed(1)}k <span className="text-xs font-normal text-slate-500">net</span>
                      </p>
                    </Link>
                  );
                })}
              </div>

              {/* View Full Calculator Button */}
              <div className="mt-5 pt-4">
                <Link href={`/salary-calculator/${state.slug}/75k/`} className="inline-flex items-center justify-center w-full bg-white border border-slate-300 text-slate-600 font-semibold py-2.5 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors text-sm">
                  View {state.name} Tax Calculator →
                </Link>
              </div>

            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
