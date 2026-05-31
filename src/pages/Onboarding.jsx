import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import GlassCard from '../components/shared/GlassCard';
import AnimatedCounter from '../components/shared/AnimatedCounter';
import ProgressRing from '../components/shared/ProgressRing';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import { useUser } from '../context/UserContext';
import { getBaselineAssessment } from '../services/aiService';

const COLORS = ['#ff5252', '#ff4081', '#e040fb', '#7c4dff', '#536dfe', '#448aff', '#18ffff', '#1de9b6', '#00e676', '#c6ff00', '#ffea00', '#ffab40'];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [profile, setProfile] = useState({ username: '', color: COLORS[7], country: 'US', city: '', role: 'Student' });
  const [answers, setAnswers] = useState({ meat: 3, transport: 'Car', distance: 15, energy: 'Mixed', flights: 'Once a year', shopping: 5, streaming: 2, wfh: 0 });
  const [baseline, setBaseline] = useState(null);
  const [goal, setGoal] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleNext = async () => {
    if (step === 3) {
      setIsCalculating(true);
      const result = await getBaselineAssessment(answers);
      setBaseline(result);
      setIsCalculating(false);
    }
    setStep(s => s + 1);
  };

  const handleFinish = () => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    setUser({
      ...profile,
      baseline,
      goal,
      joinedAt: new Date().toISOString()
    });
    setTimeout(() => navigate('/'), 2000);
  };

  const slideVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-bg-primary">
      <div className="ambient-glow"></div>
      <div className="ambient-glow-2"></div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="text-center z-10">
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 text-white">
              See your planet.<br/><span className="text-accent-green">Own your impact.</span>
            </h1>
            <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
              EcoLens Pro uses live planetary data and AI to help you track, understand, and reduce your carbon footprint.
            </p>
            <button onClick={handleNext} className="bg-accent-green text-bg-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,230,118,0.4)]">
              Get Started
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-xl z-10">
            <GlassCard title="Profile Setup" className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Username</label>
                  <input type="text" value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})} className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-green" placeholder="EcoWarrior" />
                </div>
                
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Avatar Color</label>
                  <div className="flex gap-3 flex-wrap">
                    {COLORS.map(c => (
                      <button key={c} onClick={() => setProfile({...profile, color: c})} className={`w-8 h-8 rounded-full ${profile.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-bg-surface' : ''}`} style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Country</label>
                    <select value={profile.country} onChange={e => setProfile({...profile, country: e.target.value})} className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-green">
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="IN">India</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">City</label>
                    <input type="text" value={profile.city} onChange={e => setProfile({...profile, city: e.target.value})} className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-green" placeholder="e.g. New York" />
                  </div>
                </div>

                <button onClick={handleNext} disabled={profile.username.length < 3 || !profile.city} className="w-full bg-accent-green text-bg-primary px-6 py-3 rounded-xl font-bold mt-4 disabled:opacity-50">
                  Continue
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-2xl z-10">
            <GlassCard title="Baseline Assessment">
              {isCalculating ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-[rgba(255,255,255,0.1)] border-t-accent-green rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="text-xl font-heading text-white mb-2">AI is analyzing your baseline...</h3>
                  <p className="text-text-secondary">Crunching the numbers with emission factors.</p>
                </div>
              ) : baseline ? (
                <div className="text-center py-8">
                  <ProgressRing value={baseline.planet_score} size={160} label="Planet Score" />
                  <div className="mt-8 mb-6">
                    <div className="text-text-secondary uppercase text-sm mb-1">Estimated Annual Emissions</div>
                    <div className="text-5xl font-heading font-bold text-white"><AnimatedCounter value={baseline.estimated_annual_kg} /> <span className="text-xl font-normal text-text-secondary">kg CO₂</span></div>
                  </div>
                  <div className="flex gap-2 justify-center mb-6">
                    {baseline.top_sources.map(s => <span key={s} className="px-3 py-1 bg-[rgba(255,255,255,0.1)] rounded-full text-sm">{s}</span>)}
                  </div>
                  <p className="text-accent-teal italic font-medium">{baseline.encouragement}</p>
                  <button onClick={handleNext} className="mt-8 bg-accent-green text-bg-primary px-8 py-3 rounded-xl font-bold">Set a Goal</button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Meat consumption per week: {answers.meat} days</label>
                    <input type="range" min="0" max="7" value={answers.meat} onChange={e => setAnswers({...answers, meat: Number(e.target.value)})} className="w-full accent-accent-green" />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Daily commute distance: {answers.distance} km</label>
                    <input type="range" min="0" max="100" value={answers.distance} onChange={e => setAnswers({...answers, distance: Number(e.target.value)})} className="w-full accent-accent-green" />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Home energy source</label>
                    <select value={answers.energy} onChange={e => setAnswers({...answers, energy: e.target.value})} className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2 text-white">
                      <option>Coal Grid</option><option>Mixed</option><option>Mostly Renewable</option><option>Solar</option>
                    </select>
                  </div>
                  <button onClick={handleNext} className="w-full bg-white text-bg-primary px-6 py-3 rounded-xl font-bold mt-4">
                    Analyze Footprint
                  </button>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-4xl z-10">
            <h2 className="text-3xl font-heading font-bold text-center mb-8 text-white">Choose Your First Goal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Reach Planet Score 80 in 30 days",
                "Reduce weekly emissions by 25%",
                "Complete a 30-day logging streak",
                "Achieve a net-zero day this month"
              ].map(g => (
                <GlassCard key={g} onClick={() => { setGoal(g); handleNext(); }} className="cursor-pointer hover:border-accent-green group transition-all duration-300">
                  <div className="text-lg font-medium text-white group-hover:text-accent-green transition-colors">{g}</div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="step5" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="text-center z-10">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-bg-primary shadow-[0_0_30px_rgba(255,255,255,0.2)]" style={{ backgroundColor: profile.color }}>
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-4xl font-heading font-bold mb-4 text-white">You're ready, {profile.username}!</h2>
            <p className="text-xl text-text-secondary mb-8">Your baseline is set. Your goal is locked. Let's make an impact.</p>
            <button onClick={handleFinish} className="bg-accent-green text-bg-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-white transition-all transform hover:scale-105">
              Enter Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
