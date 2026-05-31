import { useEffect } from 'react';
import { useEmissions } from './useEmissions';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import confetti from 'canvas-confetti';

export function useBadgeEvaluator() {
  const { logs } = useEmissions();
  const { user, streak, level, badges, unlockBadge } = useUser();
  const { addToast } = useToast();

  useEffect(() => {
    if (!logs || !user) return;

    const checkAndUnlock = (id, name, condition) => {
      if (!badges.includes(id) && condition) {
        if (unlockBadge(id)) {
          addToast({ type: 'badge', title: 'Badge Unlocked!', message: name });
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#ffd740', '#ffffff'] });
        }
      }
    };

    // Logging Badges
    checkAndUnlock('b1', 'First Step', logs.length >= 1);
    checkAndUnlock('b2', 'Dedicated Logger', streak.longest >= 7);
    checkAndUnlock('b3', 'On Fire', streak.longest >= 30);
    checkAndUnlock('b4', 'Century', logs.length >= 100);

    // Score / Level Milestones
    checkAndUnlock('b29', 'Planet Protector', user.baseline?.planet_score >= 75);
    checkAndUnlock('b30', 'Climate Guardian', level >= 25);

    // Food Badges
    const veganMeals = logs.filter(l => l.category === 'food' && l.subcategory === 'vegan').length;
    checkAndUnlock('b11', 'Salad Days', veganMeals >= 5);
    
    // Transport Badges
    const ecoTransport = logs.filter(l => l.category === 'transport' && (l.subcategory === 'walk' || l.subcategory === 'cycle')).length;
    checkAndUnlock('b16', 'Walkabout', ecoTransport >= 10);
    
    const transit = logs.filter(l => l.category === 'transport' && (l.subcategory === 'bus' || l.subcategory === 'train')).length;
    checkAndUnlock('b17', 'Transit Hero', transit >= 15);

    const ev = logs.filter(l => l.category === 'transport' && l.subcategory === 'ev').length;
    checkAndUnlock('b20', 'Electric Dreams', ev >= 10);

    // Energy / Utility Badges
    const solar = logs.filter(l => l.subcategory === 'solar').length;
    checkAndUnlock('b21', 'Solar Hero', solar >= 5);

    // Shopping / Secondhand
    const secondhand = logs.filter(l => l.inputs?.isSecondhand).length;
    checkAndUnlock('b24', 'Second Life', secondhand >= 5);

  }, [logs, streak, level, user, badges, unlockBadge, addToast]);
}
