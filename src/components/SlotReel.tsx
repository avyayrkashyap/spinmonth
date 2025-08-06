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

    // Create extended array for smooth spinning effect
    const extendedItems = [...items, ...items, ...items];

    useImperativeHandle(ref, () => ({
      startSpin: () => {
        setIsSpinning(true);
        let currentIndex = 0;
        
        spinIntervalRef.current = setInterval(() => {
          currentIndex = (currentIndex + 1) % extendedItems.length;
          setDisplayIndex(currentIndex);
        }, 50);
      },
      stopSpin: () => {
        if (spinIntervalRef.current) {
          clearInterval(spinIntervalRef.current);
          spinIntervalRef.current = null;
        }
        
        // Choose a random final position, but ensure we return the item that will be in the center
        const finalIndex = Math.floor(Math.random() * items.length);
        
        // Set the display so that the chosen item appears in the center (index 2 of visible items)
        // We need to offset by 2 to put our target item in the center viewing window
        const centerOffset = 2;
        const adjustedIndex = (finalIndex + items.length - centerOffset) % items.length;
        setDisplayIndex(adjustedIndex);
        setIsSpinning(false);
        
        // Return the item that will actually be visible in the center window
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