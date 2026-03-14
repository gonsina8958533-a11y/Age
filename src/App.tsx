import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Gift, Info, ChevronRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthdayDays: number;
}

export default function App() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateAge = (dateString: string) => {
    if (!dateString) return;

    const birth = new Date(dateString);
    const today = new Date();

    if (birth > today) {
      setError("Birth date cannot be in the future");
      setResult(null);
      return;
    }

    setError(null);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Total days lived
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Next birthday
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const nextDiffTime = Math.abs(nextBirthday.getTime() - today.getTime());
    const nextBirthdayDays = Math.ceil(nextDiffTime / (1000 * 60 * 60 * 24));

    setResult({
      years,
      months,
      days,
      totalDays,
      nextBirthdayDays
    });
  };

  useEffect(() => {
    if (birthDate) {
      calculateAge(birthDate);
    }
  }, [birthDate]);

  const handleReset = () => {
    setBirthDate('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-zinc-900 font-sans selection:bg-zinc-200">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-24">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-black/5 mb-4">
            <Clock className="w-6 h-6 text-zinc-600" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight mb-2">Chronos</h1>
          <p className="text-zinc-500">Precision age and time tracking</p>
        </motion.header>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-sm border border-black/5 p-8 md:p-10"
        >
          <div className="space-y-8">
            <div>
              <label htmlFor="birthdate" className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-3">
                Select your birth date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="birthdate"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-all text-lg appearance-none"
                />
                <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
              </div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-red-500 text-sm mt-3 flex items-center gap-2"
                >
                  <Info className="w-4 h-4" /> {error}
                </motion.p>
              )}
            </div>

            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-10"
                >
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                      <span className="block text-4xl font-light mb-1">{result.years}</span>
                      <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Years</span>
                    </div>
                    <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                      <span className="block text-4xl font-light mb-1">{result.months}</span>
                      <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Months</span>
                    </div>
                    <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                      <span className="block text-4xl font-light mb-1">{result.days}</span>
                      <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Days</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-zinc-50/50 border border-zinc-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-black/5">
                          <Clock className="w-5 h-5 text-zinc-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Total days lived</p>
                          <p className="text-xs text-zinc-400">Since your birth</p>
                        </div>
                      </div>
                      <span className="text-lg font-medium">{result.totalDays.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between p-5 rounded-2xl bg-zinc-50/50 border border-zinc-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-black/5">
                          <Gift className="w-5 h-5 text-zinc-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Next birthday</p>
                          <p className="text-xs text-zinc-400">Days remaining</p>
                        </div>
                      </div>
                      <span className="text-lg font-medium">{result.nextBirthdayDays}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 group"
                  >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    Reset Calculator
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-zinc-50 border border-dashed border-zinc-200 mx-auto mb-4 flex items-center justify-center">
                    <ChevronRight className="w-6 h-6 text-zinc-300" />
                  </div>
                  <p className="text-zinc-400 text-sm">Enter your birth date above to see the results</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-zinc-400 uppercase tracking-widest">
            Designed for clarity & precision
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
