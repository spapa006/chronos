import React, { useState, useEffect } from 'react';
import { calculateAge, isValidDate } from './utils/dateHelper.ts';
import { getHistoricalInsights } from './services/geminiService.ts';
import { AgeResult, LegalPage } from './types.ts';
import { LegalModal } from './components/LegalModals.tsx';
import { AdUnit } from './components/AdUnit.tsx';

// Icons
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const App: React.FC = () => {
  const [birthDateStr, setBirthDateStr] = useState<string>('');
  const [result, setResult] = useState<AgeResult | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Legal Modal State
  const [legalModalType, setLegalModalType] = useState<LegalPage>(LegalPage.None);

  const handleCalculate = async () => {
    setError('');
    setAiInsight(null);
    setResult(null);

    if (!birthDateStr) {
      setError('Please enter your date of birth.');
      return;
    }

    const date = new Date(birthDateStr);
    if (!isValidDate(date)) {
      setError('Please enter a valid date in the past.');
      return;
    }

    const ageData = calculateAge(date);
    setResult(ageData);

    // Fetch AI Insights
    setIsLoadingAi(true);
    try {
      const insight = await getHistoricalInsights(date);
      setAiInsight(insight);
    } catch (e) {
      console.error(e);
      // Fail silently for AI part, core feature is calculator
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-brand-600 p-2 rounded-lg text-white">
               <ClockIcon />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Chronos<span className="text-brand-600">.ai</span></h1>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-600">
            <button onClick={() => setLegalModalType(LegalPage.About)} className="hover:text-brand-600 transition-colors">About</button>
            <button onClick={() => setLegalModalType(LegalPage.Privacy)} className="hover:text-brand-600 transition-colors">Privacy</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50 px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Introduction / Hero Text for SEO/AdSense Value */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Calculate Your Exact Age</h2>
            <p className="text-slate-600 max-w-lg mx-auto leading-relaxed">
              Discover exactly how many years, months, and days you've been alive. 
              Get precise calculations and fun AI-powered historical facts about your birth date.
            </p>
          </div>

          {/* Calculator Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <label htmlFor="birthdate" className="block text-sm font-semibold text-slate-700">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="birthdate"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none text-slate-800 text-lg"
                    value={birthDateStr}
                    onChange={(e) => setBirthDateStr(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <button
                onClick={handleCalculate}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Calculate Age</span>
                <CalendarIcon />
              </button>
            </div>
          </div>

          {/* Top Ad Unit - High Visibility (Display) */}
          <AdUnit className="min-h-[120px]" slotId="top-banner-slot" />

          {/* Results Section */}
          {result && (
            <div className="animate-fade-in-up space-y-6">
              
              {/* Primary Result */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 md:p-8 text-center border-t-4 border-t-brand-500">
                <h3 className="text-slate-500 font-medium uppercase tracking-wide text-sm mb-2">You are currently</h3>
                <div className="flex flex-wrap justify-center items-baseline gap-2 md:gap-4 text-brand-900">
                  <span className="text-5xl md:text-6xl font-bold tracking-tight">{result.years}</span>
                  <span className="text-xl md:text-2xl font-medium text-slate-600">years</span>
                  <span className="text-5xl md:text-6xl font-bold tracking-tight">{result.months}</span>
                  <span className="text-xl md:text-2xl font-medium text-slate-600">months</span>
                  <span className="text-5xl md:text-6xl font-bold tracking-tight">{result.days}</span>
                  <span className="text-xl md:text-2xl font-medium text-slate-600">days old</span>
                </div>
              </div>

              {/* Detailed Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Months', value: result.totalMonths.toLocaleString() },
                    { label: 'Total Weeks', value: result.totalWeeks.toLocaleString() },
                    { label: 'Total Days', value: result.totalDays.toLocaleString() },
                    { label: 'Total Hours', value: result.totalHours.toLocaleString() },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                        <span className="text-slate-400 text-xs font-semibold uppercase mb-1">{item.label}</span>
                        <span className="text-xl md:text-2xl font-bold text-slate-800">{item.value}</span>
                    </div>
                ))}
              </div>

              {/* Next Birthday */}
              <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <h4 className="text-white/90 font-medium text-lg">Next Birthday</h4>
                        <p className="text-sm text-white/80">Your special day is coming up on a {result.nextBirthday.dayOfWeek}.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                        <div className="text-center">
                            <span className="block text-2xl font-bold">{result.nextBirthday.months}</span>
                            <span className="text-xs uppercase opacity-80">Months</span>
                        </div>
                        <div className="h-8 w-px bg-white/30"></div>
                        <div className="text-center">
                            <span className="block text-2xl font-bold">{result.nextBirthday.days}</span>
                            <span className="text-xs uppercase opacity-80">Days</span>
                        </div>
                    </div>
                </div>
              </div>

              {/* AI Insight Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 md:p-8 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-t-2xl"></div>
                <div className="flex items-center mb-4 space-x-2 text-indigo-700">
                    <SparklesIcon />
                    <h3 className="font-bold text-lg">AI Historical Insights</h3>
                </div>
                
                {isLoadingAi ? (
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    </div>
                ) : aiInsight ? (
                    <div className="prose prose-indigo text-slate-600 leading-relaxed text-sm md:text-base">
                        {aiInsight}
                    </div>
                ) : (
                    <p className="text-slate-400 italic text-sm">Insights unavailable.</p>
                )}
              </div>
            </div>
          )}

          {/* Bottom Ad Unit - Lower Visibility (Display or Matched Content) */}
          <AdUnit className="min-h-[250px] mt-8" slotId="bottom-banner-slot" />
          
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500">
                &copy; {new Date().getFullYear()} Chronos. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-slate-600">
                <button onClick={() => setLegalModalType(LegalPage.Privacy)} className="hover:text-brand-600">Privacy Policy</button>
                <button onClick={() => setLegalModalType(LegalPage.Terms)} className="hover:text-brand-600">Terms of Use</button>
                <button onClick={() => setLegalModalType(LegalPage.About)} className="hover:text-brand-600">About</button>
            </div>
        </div>
      </footer>

      {/* Modals */}
      <LegalModal 
        isOpen={legalModalType !== LegalPage.None} 
        onClose={() => setLegalModalType(LegalPage.None)} 
        type={legalModalType} 
      />
    </div>
  );
};

export default App;