import React, { useState, useEffect } from 'react';
import AgeTimer from './components/AgeTimer';
import BirthdayCard from './components/BirthdayCard';
import { getLastBirthday, getNextBirthday, getMilestoneBirthday } from './utils/dateUtils';
import { CalendarIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  // Hardcoded birth date: 25 October 1998 5:30 AM
  const [birthDate] = useState<Date>(new Date('1998-10-25T05:30:00'));
  const [now, setNow] = useState(new Date());

  // Dynamic Milestones State
  const [milestones, setMilestones] = useState<number[]>([30, 40, 50]);
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestoneInput, setNewMilestoneInput] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const lastBirthday = getLastBirthday(birthDate);
  const nextBirthday = getNextBirthday(birthDate);
  
  // Calculate ages for display
  const lastBirthdayAge = lastBirthday.getFullYear() - birthDate.getFullYear();
  const nextBirthdayAge = nextBirthday.getFullYear() - birthDate.getFullYear();

  // Progress towards next birthday
  const totalYearDuration = nextBirthday.getTime() - lastBirthday.getTime();
  const timeElapsedInYear = now.getTime() - lastBirthday.getTime();
  const nextBirthdayProgress = (timeElapsedInYear / totalYearDuration) * 100;

  const addMilestone = () => {
    const age = parseInt(newMilestoneInput);
    if (age && !isNaN(age) && age > 0 && !milestones.includes(age)) {
      setMilestones(prev => [...prev, age].sort((a, b) => a - b));
      setNewMilestoneInput('');
      setIsAddingMilestone(false);
    }
  };

  const removeMilestone = (ageToRemove: number) => {
    setMilestones(prev => prev.filter(m => m !== ageToRemove));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans selection:bg-teal-200">
      
      {/* Header */}
      <header className="max-w-2xl mx-auto flex justify-center items-center mb-10">
        <div className="flex items-center gap-5 bg-white px-8 py-4 rounded-3xl shadow-sm border border-slate-200">
           <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0 rotate-3">
             <CalendarIcon className="w-6 h-6 text-white" />
           </div>
           <div className="flex flex-col justify-center">
              <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">Sumon Hossain</span>
              <div className="h-px w-full bg-slate-100 my-2"></div>
              <span className="text-sm font-bold text-teal-700 uppercase tracking-widest font-mono">25 October 1998 • 5:30 AM</span>
           </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto space-y-8 pb-20">
        
        {/* 1. Last Birthday - Purple Theme (Completed) */}
        <section>
           <BirthdayCard 
            title="Last Birthday (Completed)" 
            date={lastBirthday} 
            showCountdown={false}
            age={lastBirthdayAge}
            theme="purple"
            progress={100}
          />
        </section>

        {/* 2. Present Age - Teal Theme (Active Life) */}
        <section>
          <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-200 relative overflow-hidden transition-all hover:shadow-md">
            {/* Main Gradient Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400"></div>
            <AgeTimer birthDate={birthDate} theme="teal" />
          </div>
        </section>

        {/* 3. Next Birthday - Orange Theme (In Progress) */}
        <section>
          <BirthdayCard 
            title="Next Birthday (Loading...)" 
            date={nextBirthday} 
            showCountdown={true} 
            age={nextBirthdayAge}
            theme="orange"
            progress={nextBirthdayProgress}
          />
        </section>

        {/* 4. Milestones - Blue Theme (Dynamic) */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 px-2 opacity-50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Upcoming Birthdays</span>
              <div className="h-px bg-slate-300 flex-grow"></div>
           </div>
           
           {milestones.map((milestoneAge) => {
             const date = getMilestoneBirthday(birthDate, milestoneAge);
             const totalLife = date.getTime() - birthDate.getTime();
             const elapsedLife = now.getTime() - birthDate.getTime();
             const progress = Math.min(100, Math.max(0, (elapsedLife / totalLife) * 100));
             
             return (
               <BirthdayCard 
                key={milestoneAge}
                title={`${milestoneAge}th Birthday`} 
                date={date} 
                showCountdown={true} 
                age={milestoneAge}
                theme="blue"
                progress={progress}
                onRemove={() => removeMilestone(milestoneAge)}
              />
             );
           })}

           {/* Add Milestone Button */}
           <div className="pt-2">
              {!isAddingMilestone ? (
                <button 
                    onClick={() => setIsAddingMilestone(true)}
                    className="w-full py-4 border-2 border-dashed border-slate-300 rounded-3xl text-slate-400 font-bold uppercase tracking-widest hover:border-teal-400 hover:text-teal-500 hover:bg-teal-50/50 transition-all flex items-center justify-center gap-2 group"
                >
                    <PlusIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Add Birthday
                </button>
              ) : (
                <div className="bg-white p-2 sm:p-4 rounded-3xl border border-teal-200 shadow-lg shadow-teal-500/10 flex gap-2 sm:gap-3 items-center animate-in fade-in zoom-in duration-200">
                    <input 
                        type="number" 
                        value={newMilestoneInput}
                        onChange={(e) => setNewMilestoneInput(e.target.value)}
                        placeholder="Birthday Age (e.g. 35)"
                        className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && addMilestone()}
                    />
                    <button 
                        onClick={addMilestone}
                        className="bg-teal-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-teal-600 transition-colors shadow-md shadow-teal-500/20"
                    >
                        Add
                    </button>
                    <button 
                        onClick={() => setIsAddingMilestone(false)}
                        className="text-slate-400 hover:text-slate-600 p-3 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
              )}
           </div>
        </section>

      </main>

      <footer className="text-center text-slate-300 text-xs">
        <p>© {new Date().getFullYear()} Sumon Hossain Life Tracker</p>
      </footer>
    </div>
  );
};

export default App;