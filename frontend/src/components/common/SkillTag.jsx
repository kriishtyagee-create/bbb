import React from 'react';
import { Star, Flame } from 'lucide-react';

export const SkillTag = ({
  name,
  proficiency = 'Intermediate',
  rating = 3,
  demandLevel = 'High',
  category = 'Technical',
  showRating = false,
  showDemand = false,
  onDelete = null,
}) => {
  const getDemandBadge = (demand) => {
    switch (demand?.toLowerCase()) {
      case 'very high':
      case 'high':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'medium':
      case 'moderate':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs hover:border-emerald-300 transition-colors">
      <span className="text-xs font-semibold text-slate-800">{name}</span>

      {showRating && (
        <div className="flex items-center text-amber-500 ml-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3 h-3 ${
                star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
              }`}
            />
          ))}
        </div>
      )}

      {showDemand && (
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded border font-medium flex items-center gap-0.5 ${getDemandBadge(
            demandLevel
          )}`}
        >
          <Flame className="w-2.5 h-2.5" /> {demandLevel} Demand
        </span>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="ml-1 text-slate-400 hover:text-rose-600 transition-colors text-xs font-bold"
          title="Remove skill"
        >
          ×
        </button>
      )}
    </div>
  );
};
