import React from 'react';
import { Heart, Activity, Apple, Dumbbell, Droplet, Shield, Zap, Sparkles } from 'lucide-react';

export function LifestyleAdvice({ recommendations, t }) {
  const iconMap = {
    Heart,
    Activity,
    Apple,
    Dumbbell,
    Droplet,
    Shield,
    Zap,
    Sparkles
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Apple className="w-5 h-5 text-emerald-600" />
          <span>{t.lifestyleTitle}</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.lifestyleDesc}
        </p>
      </div>

      {/* Recommendations Cards */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => {
          const Icon = iconMap[rec.icon] || Sparkles;

          return (
            <div
              key={index}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start space-x-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 shadow-sm">
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  {rec.category}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {rec.advice}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
