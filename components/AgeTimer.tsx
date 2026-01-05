import React, { useEffect, useState } from 'react';
import { AgeDetail, calculatePreciseAge, formatDate } from '../utils/dateUtils';
import { ThemeColor } from './BirthdayCard';

interface AgeTimerProps {
  birthDate: Date;
  theme: ThemeColor;
}

const themeHighlights: Record<ThemeColor, string> = {
  teal: 'bg-teal-500 text-white shadow-lg shadow-teal-500/30',
  orange: 'bg-orange-500 text-white shadow-lg shadow-orange-500/30',
  purple: 'bg-purple-500 text-white shadow-lg shadow-purple-500/30',
  blue: 'bg-blue-500 text-white shadow-lg shadow-blue-500/30',
  rose: 'bg-rose-500 text-white shadow-lg shadow-rose-500/30',
};

const textHighlights: Record<ThemeColor, string> = {
  teal: 'text-teal-50',
  orange: 'text-orange-50',
  purple: 'text-purple-50',
  blue: 'text-blue-50',
  rose: 'text-rose-50',
};

const labelColors: Record<ThemeColor, string> = {
    teal: 'text-teal-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    rose: 'text-rose-600',
};

const TimeUnit: React.FC<{ value: number; label: string; highlight?: boolean; theme: ThemeColor }> = ({ value, label, highlight, theme }) => (
  <div className={`flex flex-col items-center justify-center py-3 px-1 sm:p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
    highlight 
      ? themeHighlights[theme]
      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
  }`}>
    <span className={`text-xl sm:text-3xl md:text-4xl font-mono font-bold leading-none mb-1 sm:mb-2`}>
      {value.toString().padStart(2, '0')}
    </span>
    <span className={`text-[9px] sm:text-xs font-bold uppercase tracking-wider opacity-90 ${highlight ? textHighlights[theme] : 'text-slate-400'}`}>
      {label}
    </span>
  </div>
);

const AgeTimer: React.FC<AgeTimerProps> = ({ birthDate, theme }) => {
  const [age, setAge] = useState<AgeDetail>(calculatePreciseAge(birthDate));
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    setCurrentDate(new Date());
    setAge(calculatePreciseAge(birthDate));

    const timer = setInterval(() => {
      setCurrentDate(new Date());
      setAge(calculatePreciseAge(birthDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [birthDate]);

  return (
    <div className="w-full">
      
      {/* Line 1: Header / Present Date Label */}
      <div className="flex flex-col justify-start items-start mb-2 pb-2 border-b border-slate-100 gap-1">
         <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${labelColors[theme]}`}>Present Date</span>
         <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-xl md:text-2xl font-bold text-slate-800">
               {formatDate(currentDate)}
            </span>
         </div>
      </div>

      {/* Line 2: Live Age Label */}
      <div className="flex justify-start w-full mb-3">
         <span className={`text-xs font-bold uppercase tracking-widest ${labelColors[theme]}`}>Live Age</span>
      </div>

      {/* Line 3: Age Timer Grid - Always 6 columns */}
      <div className="grid grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        <TimeUnit value={age.years} label="Yrs" highlight theme="teal" />
        <TimeUnit value={age.months} label="Mos" highlight theme="blue" />
        <TimeUnit value={age.days} label="Days" highlight theme="purple" />
        <TimeUnit value={age.hours} label="Hrs" highlight theme="rose" />
        <TimeUnit value={age.minutes} label="Min" highlight theme="orange" />
        <TimeUnit value={age.seconds} label="Sec" highlight theme="teal" />
      </div>
    </div>
  );
};

export default AgeTimer;