import { useState, useRef, useCallback } from 'react';
import { SlotReel } from './SlotReel';
import { SlotLever } from './SlotLever';
import { WinCelebration } from './WinCelebration';
import { cn } from '@/lib/utils';

const COLUMN_DATA = {
  first: ['Jan', 'Febr', 'Ma', 'Ap', 'M', 'J', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  second: ['u', 'r', 'a', 'em', 'o'],
  third: ['ary', 'ch', 'il', 'y', 'ne', 'ly', 'st', 'ber']
};

const WINNING_COMBINATIONS = [
  { first: 'Jan', second: 'u', third: 'ary', month: 'January' },
  { first: 'Febr', second: 'u', third: 'ary', month: 'February' },
  { first: 'Ma', second: 'r', third: 'ch', month: 'March' },
  { first: 'Ap', second: 'r', third: 'il', month: 'April' },
  { first: 'M', second: 'a', third: 'y', month: 'May' },
  { first: 'J', second: 'u', third: 'ne', month: 'June' },
  { first: 'J', second: 'u', third: 'ly', month: 'July' },
  { first: 'Aug', second: 'u', third: 'st', month: 'August' },
  { first: 'Sept', second: 'em', third: 'ber', month: 'September' },
  { first: 'Oct', second: 'o', third: 'ber', month: 'October' },
  { first: 'Nov', second: 'em', third: 'ber', month: 'November' },
  { first: 'Dec', second: 'em', third: 'ber', month: 'December' }
];

export const SlotMachine = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentValues, setCurrentValues] = useState({
    first: COLUMN_DATA.first[0],
    second: COLUMN_DATA.second[0],
    third: COLUMN_DATA.third[0]
  });
  const [winner, setWinner] = useState<string | null>(null);
  const [leverPulled, setLeverPulled] = useState(false);

  const reelRefs = useRef<{
    first: any;
    second: any;
    third: any;
  }>({
    first: null,
    second: null,
    third: null
  });

  const checkWinningCombination = useCallback((values: typeof currentValues) => {
    const winningCombo = WINNING_COMBINATIONS.find(
      combo => combo.first === values.first && 
               combo.second === values.second && 
               combo.third === values.third
    );
    return winningCombo?.month || null;
  }, []);

  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);
    setLeverPulled(true);

    // Start spinning all reels
    Object.values(reelRefs.current).forEach(reel => {
      if (reel) reel.startSpin();
    });

    // Stop reels at different times for realistic effect
    const stopTimes = [2000, 2500, 3000]; // Different stop times for each reel
    const finalValues: any = {};

    stopTimes.forEach((time, index) => {
      const reelKey = ['first', 'second', 'third'][index] as keyof typeof COLUMN_DATA;
      
      setTimeout(() => {
        if (reelRefs.current[reelKey]) {
          const finalValue = reelRefs.current[reelKey].stopSpin();
          finalValues[reelKey] = finalValue;
          
          // Check for win after all reels have stopped
          if (Object.keys(finalValues).length === 3) {
            setCurrentValues(finalValues);
            const winningMonth = checkWinningCombination(finalValues);
            if (winningMonth) {
              setWinner(winningMonth);
            }
            setIsSpinning(false);
          }
        }
      }, time);
    });

    // Reset lever animation
    setTimeout(() => setLeverPulled(false), 600);
  }, [isSpinning, checkWinningCombination]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <div className="relative">
        {/* Slot Machine Frame */}
        <div className={cn(
          "relative bg-gradient-to-b from-slot-red to-red-900 p-8 rounded-xl",
          "shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-slot-gold",
          winner && "animate-win-glow"
        )}>
          {/* Machine Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-slot-gold mb-2 font-mono tracking-wider">
              MONTH MACHINE
            </h1>
            <div className="flex justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full bg-slot-gold",
                    winner && "animate-pulse"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Reels Container */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <SlotReel
              ref={(el) => (reelRefs.current.first = el)}
              items={COLUMN_DATA.first}
              currentValue={currentValues.first}
              isWinning={winner !== null}
            />
            <SlotReel
              ref={(el) => (reelRefs.current.second = el)}
              items={COLUMN_DATA.second}
              currentValue={currentValues.second}
              isWinning={winner !== null}
            />
            <SlotReel
              ref={(el) => (reelRefs.current.third = el)}
              items={COLUMN_DATA.third}
              currentValue={currentValues.third}
              isWinning={winner !== null}
            />
          </div>

          {/* Current Combination Display */}
          <div className="text-center mb-6">
            <div className="bg-slot-reel border-2 border-slot-gold rounded-lg p-4">
              <div className="text-slot-gold text-lg font-mono">
                Current: {currentValues.first}{currentValues.second}{currentValues.third}
              </div>
            </div>
          </div>

          {/* Spin Status */}
          <div className="text-center mb-6 h-8">
            {isSpinning && (
              <div className="text-slot-gold text-xl font-bold animate-pulse">
                SPINNING...
              </div>
            )}
            {winner && !isSpinning && (
              <div className="text-slot-gold text-2xl font-bold animate-bounce-in">
                🎉 WINNER: {winner}! 🎉
              </div>
            )}
          </div>
        </div>

        {/* Lever */}
        <SlotLever 
          onPull={handleSpin} 
          disabled={isSpinning}
          isPulled={leverPulled}
        />

        {/* Win Celebration */}
        {winner && <WinCelebration month={winner} />}
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center max-w-md">
        <p className="text-muted-foreground text-sm">
          Pull the lever to spin! Match the fragments to spell out a complete month name and win!
        </p>
      </div>
    </div>
  );
};