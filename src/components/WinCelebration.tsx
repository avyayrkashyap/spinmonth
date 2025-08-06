import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface WinCelebrationProps {
  month: string;
}

export const WinCelebration = ({ month }: WinCelebrationProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; delay: number; direction: number }>>([]);

  useEffect(() => {
    // Generate celebration particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 1000,
      direction: Math.random() > 0.5 ? 1 : -1
    }));
    setParticles(newParticles);
  }, [month]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Celebration Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={cn(
            "absolute w-2 h-2 bg-slot-gold rounded-full animate-bounce-in",
            "shadow-[0_0_10px_hsl(var(--slot-gold))]"
          )}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${particle.delay}ms`,
            animationDuration: '2s'
          }}
        />
      ))}
      
      {/* Win Banner */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className={cn(
          "bg-gradient-to-r from-slot-gold to-yellow-400 text-black",
          "px-8 py-4 rounded-xl border-4 border-yellow-600",
          "shadow-[0_0_30px_hsl(var(--slot-gold)/0.8)]",
          "animate-bounce-in font-bold text-2xl text-center",
          "transform rotate-3"
        )}>
          🎰 JACKPOT! 🎰
          <br />
          <span className="text-xl">{month}</span>
        </div>
      </div>
      
      {/* Flashing Lights Effect */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-4 h-4 bg-slot-gold rounded-full animate-pulse",
              "shadow-[0_0_15px_hsl(var(--slot-gold))]"
            )}
            style={{
              top: `${(i * 12.5) + 5}%`,
              left: i % 2 === 0 ? '5%' : '90%',
              animationDelay: `${i * 200}ms`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    </div>
  );
};