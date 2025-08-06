import { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SlotReelProps {
  items: string[];
  currentValue: string;
  isWinning: boolean;
}

export interface SlotReelRef {
  startSpin: () => void;
  stopSpin: () => string;
}

export const SlotReel = forwardRef<SlotReelRef, SlotReelProps>(
  ({ items, currentValue, isWinning }, ref) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Create extended array for smooth spinning effect
    const extendedItems = [...items, ...items, ...items];

    useImperativeHandle(ref, () => ({
      startSpin: () => {
        setIsSpinning(true);
        
        // Clear any existing timeouts
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
        if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
        
        let currentIndex = 0;
        let spinStep = 0;
        const totalSteps = 150; // Total animation steps
        
        const spin = () => {
          if (spinStep < totalSteps) {
            // Easing function: slow start, fast middle, slow end
            let speed;
            const progress = spinStep / totalSteps;
            
            if (progress < 0.2) {
              // Acceleration phase (0-20%)
              speed = 20 + (progress / 0.2) * 130; // 20ms to 150ms
            } else if (progress < 0.8) {
              // Fast phase (20-80%)
              speed = 20; // Fastest speed
            } else {
              // Deceleration phase (80-100%)
              const decelProgress = (progress - 0.8) / 0.2;
              speed = 20 + (decelProgress * decelProgress) * 200; // Quadratic easing out
            }
            
            currentIndex = (currentIndex + 1) % extendedItems.length;
            setDisplayIndex(currentIndex);
            spinStep++;
            
            spinTimeoutRef.current = setTimeout(spin, speed);
          }
        };
        
        spin();
      },
      stopSpin: () => {
        // Clear any running animations
        if (spinIntervalRef.current) {
          clearInterval(spinIntervalRef.current);
          spinIntervalRef.current = null;
        }
        if (spinTimeoutRef.current) {
          clearTimeout(spinTimeoutRef.current);
          spinTimeoutRef.current = null;
        }
        
        // Choose a random final position
        const finalIndex = Math.floor(Math.random() * items.length);
        
        // Perform final eased settling animation
        let settleStep = 0;
        const settleSteps = 20;
        let currentSettleIndex = displayIndex;
        const targetIndex = (finalIndex + items.length - 2) % items.length;
        
        const settle = () => {
          if (settleStep < settleSteps) {
            const progress = settleStep / settleSteps;
            const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
            
            const indexDiff = ((targetIndex - displayIndex + extendedItems.length) % extendedItems.length);
            const adjustedDiff = indexDiff > extendedItems.length / 2 ? indexDiff - extendedItems.length : indexDiff;
            
            currentSettleIndex = displayIndex + Math.round(easedProgress * adjustedDiff);
            setDisplayIndex(currentSettleIndex % extendedItems.length);
            
            settleStep++;
            const settleSpeed = 50 + (progress * 100); // Gradually slow down
            spinTimeoutRef.current = setTimeout(settle, settleSpeed);
          } else {
            // Final position
            setDisplayIndex(targetIndex);
            setIsSpinning(false);
          }
        };
        
        settle();
        return items[finalIndex];
      }
    }));

    const visibleItems = extendedItems.slice(displayIndex, displayIndex + 5);

    return (
      <div className={cn(
        "relative w-24 h-40 bg-slot-reel border-4 border-slot-gold rounded-lg overflow-hidden",
        "shadow-inner",
        isWinning && "animate-win-pulse border-slot-gold-light"
      )}>
        {/* Viewing Window Highlight */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 border-y-2 border-slot-gold bg-slot-gold/10 z-10" />
        
        {/* Reel Items */}
        <div className={cn(
          "flex flex-col items-center justify-center h-full",
          isSpinning && "animate-spin-reel"
        )}>
          {visibleItems.map((item, index) => (
            <div
              key={`${item}-${index}-${displayIndex}`}
              className={cn(
                "flex items-center justify-center h-12 w-full text-center font-bold text-lg",
                "text-slot-text font-mono",
                index === 2 && !isSpinning && "text-slot-gold scale-110 font-extrabold",
                isWinning && index === 2 && "animate-pulse"
              )}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Chrome Details */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-slot-gold/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-slot-gold/30 to-transparent" />
      </div>
    );
  }
);