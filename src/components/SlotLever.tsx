import { cn } from '@/lib/utils';

interface SlotLeverProps {
  onPull: () => void;
  disabled: boolean;
  isPulled: boolean;
}

export const SlotLever = ({ onPull, disabled, isPulled }: SlotLeverProps) => {
  return (
    <div className="absolute -right-16 top-1/2 -translate-y-1/2">
      {/* Lever Base */}
      <div className="relative">
        {/* Lever Handle */}
        <button
          onClick={onPull}
          disabled={disabled}
          className={cn(
            "w-6 h-20 bg-gradient-to-b from-slot-gold to-yellow-600 rounded-full",
            "border-2 border-yellow-800 shadow-lg transform origin-bottom",
            "transition-all duration-300 hover:scale-105",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isPulled && "animate-lever-pull",
            !disabled && "hover:shadow-[0_0_20px_hsl(var(--slot-gold)/0.8)]"
          )}
        >
          {/* Lever Ball */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-red-400 to-red-600 rounded-full border-2 border-red-800 shadow-lg" />
          
          {/* Lever Handle Grip */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-12 bg-gradient-to-b from-yellow-600 to-yellow-700 rounded-full" />
        </button>

        {/* Lever Base Mount */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-6 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-lg border-2 border-gray-900 shadow-lg" />
        
        {/* Pull Instruction */}
        {!disabled && (
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-slot-gold text-xs font-bold whitespace-nowrap animate-pulse">
            PULL ME!
          </div>
        )}
      </div>
    </div>
  );
};