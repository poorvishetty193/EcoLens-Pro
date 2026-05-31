import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

const QUESTS = [
  { id: 'q1', title: 'University Sustainability Challenge', difficulty: 'Medium', impact: 10, reduction: '500kg CO₂/yr' },
  { id: 'q2', title: 'Plastic-Free Community', difficulty: 'Hard', impact: 15, reduction: '2000kg Waste/yr' },
  { id: 'q3', title: 'Zero Waste Apartment', difficulty: 'Easy', impact: 5, reduction: '100kg Waste/yr' },
  { id: 'q4', title: 'Urban Tree Initiative', difficulty: 'Medium', impact: 12, reduction: '300kg CO₂/yr' },
];

export default function EcoQuests() {
  const { completedQuests, completeQuest } = useSimulation();

  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-6">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-heading font-bold text-text-primary mb-4 glow-text">Eco Quests</h2>
        <p className="text-text-secondary text-lg">Complete meaningful missions to heal the Living Earth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {QUESTS.map((quest) => {
          const isCompleted = completedQuests.includes(quest.id);
          return (
            <div 
              key={quest.id} 
              className={`p-6 rounded-2xl border transition-all ${
                isCompleted 
                  ? 'bg-accent-green/10 border-accent-green opacity-70' 
                  : 'bg-bg-surface border-border-subtle hover:border-accent-green cursor-pointer'
              }`}
              onClick={() => !isCompleted && completeQuest(quest.id, quest.impact)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-xl font-heading font-bold ${isCompleted ? 'text-accent-green' : 'text-text-primary'}`}>
                  {quest.title}
                </h3>
                {isCompleted ? <ShieldCheck className="text-accent-green" /> : 
                 quest.difficulty === 'Hard' ? <ShieldAlert className="text-accent-red" /> : 
                 <Shield className="text-accent-amber" />}
              </div>
              
              <div className="flex gap-4 text-sm mb-6">
                <span className={`px-3 py-1 rounded-full bg-bg-primary border ${
                  quest.difficulty === 'Easy' ? 'border-accent-green text-accent-green' :
                  quest.difficulty === 'Medium' ? 'border-accent-amber text-accent-amber' :
                  'border-accent-red text-accent-red'
                }`}>
                  {quest.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full bg-bg-primary border border-border-subtle text-text-secondary">
                  +{quest.impact} Health
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-border-subtle pt-4">
                <span className="text-text-secondary text-sm">Estimated Reduction:</span>
                <span className="text-text-primary font-bold">{quest.reduction}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
