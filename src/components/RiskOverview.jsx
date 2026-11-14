import React from 'react';
import { Heart, Activity, Droplets, ShieldAlert, Sparkles, CheckCircle, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

export function RiskOverview({
  patient,
  overallIndex,
  overallUrgency,
  clinicalSummary,
  risks,
  t
}) {
  const urgencyConfig = {
    optimal: {
      label: t.riskLevels.optimal,
      color: 'emerald',
      bgBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      ringColor: '#10b981',
      icon: CheckCircle
    },
    low: {
      label: t.riskLevels.low,
      color: 'blue',
      bgBadge: 'bg-sky-100 text-sky-800 border-sky-300',
      ringColor: '#0284c7',
      icon: CheckCircle
    },
    moderate: {
      label: t.riskLevels.moderate,
      color: 'amber',
      bgBadge: 'bg-amber-100 text-amber-800 border-amber-300',
      ringColor: '#f59e0b',
      icon: AlertTriangle
    },
    high: {
      label: t.riskLevels.high,
      color: 'orange',
      bgBadge: 'bg-orange-100 text-orange-800 border-orange-300',
      ringColor: '#f97316',
      icon: AlertTriangle
    },
    critical: {
      label: t.riskLevels.critical,
      color: 'rose',
      bgBadge: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
      ringColor: '#e11d48',
      icon: AlertOctagon
    }
  };

  const currentUrgency = urgencyConfig[overallUrgency] || urgencyConfig.moderate;
  const UrgencyIcon = currentUrgency.icon;

  // Domain configurations
  const domainCards = [
    {
      id: 'cardio',
      name: t.riskCategories.cardio,
      score: risks.cardio?.score || 10,
      factors: risks.cardio?.factors || [],
      icon: Heart,
      color: risks.cardio?.score >= 60 ? 'rose' : risks.cardio?.score >= 35 ? 'amber' : 'emerald'
    },
    {
      id: 'metabolic',
      name: t.riskCategories.metabolic,
      score: risks.metabolic?.score || 10,
      factors: risks.metabolic?.factors || [],
      icon: Activity,
      color: risks.metabolic?.score >= 60 ? 'rose' : risks.metabolic?.score >= 35 ? 'amber' : 'emerald'
    },
    {
      id: 'kidney',
      name: t.riskCategories.kidney,
      score: risks.kidney?.score || 10,
      factors: risks.kidney?.factors || [],
      icon: Droplets,
      color: risks.kidney?.score >= 60 ? 'rose' : risks.kidney?.score >= 35 ? 'amber' : 'emerald'
    },
    {
      id: 'liver',
      name: t.riskCategories.liver,
      score: risks.liver?.score || 10,
      factors: risks.liver?.factors || [],
      icon: ShieldAlert,
      color: risks.liver?.score >= 60 ? 'rose' : risks.liver?.score >= 35 ? 'amber' : 'emerald'
    },
    {
      id: 'anemia',
      name: t.riskCategories.anemia,
      score: risks.anemia?.score || 10,
      factors: risks.anemia?.factors || [],
      icon: Sparkles,
      color: risks.anemia?.score >= 60 ? 'rose' : risks.anemia?.score >= 35 ? 'amber' : 'emerald'
    }
  ];

  return (
    <div className="space-y-6 mb-8">
      
      {/* Top Banner: Patient Info & Overall Urgency */}
      <div className="bg-gradient-to-r from-slate-900 via-clinical-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-clinical-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          {/* Patient Details */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-clinical-300 uppercase tracking-widest mb-1.5">
              <span>Patient Profile</span>
              <span>•</span>
              <span>Report Evaluated {patient.date || 'Today'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {patient.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-slate-300">
              <span className="px-2.5 py-1 rounded-md bg-white/10 font-medium">Age: {patient.age}</span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 font-medium">Sex: {patient.gender}</span>
              <span className="px-2.5 py-1 rounded-md bg-clinical-500/30 text-clinical-200 border border-clinical-400/30 font-medium">
                Standard ISO 15189 Aligned
              </span>
            </div>
          </div>

          {/* Overall Health Score Ring & Urgency Badge */}
          <div className="flex items-center space-x-5 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 w-full md:w-auto justify-between md:justify-start">
            <div className="relative flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-white/20"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke={currentUrgency.ringColor}
                  strokeWidth="6"
                  strokeDasharray={201}
                  strokeDashoffset={201 - (201 * overallIndex) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold tracking-tight">{overallIndex}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-300 font-semibold">/100</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                {t.overallScore}
              </div>
              <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentUrgency.bgBadge}`}>
                <UrgencyIcon className="w-3.5 h-3.5" />
                <span>{currentUrgency.label}</span>
              </div>
            </div>
          </div>

        </div>

        {/* AI Clinical Health Synthesis Box */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center space-x-2 text-xs font-bold text-clinical-300 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-clinical-400" />
            <span>{t.overallHealthSummary}</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-200">
            {clinicalSummary}
          </p>
        </div>

      </div>

      {/* Disease Risk Prediction Cards (5 Pillars) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
            <span>{t.riskStratification}</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Calculated via Multivariable Clinical Biomarker Association
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {domainCards.map((card) => {
            const Icon = card.icon;
            const progressColor = 
              card.score >= 60 ? 'bg-rose-500' :
              card.score >= 35 ? 'bg-amber-500' :
              'bg-emerald-500';

            const scoreBg = 
              card.score >= 60 ? 'bg-rose-50 text-rose-700 border-rose-200' :
              card.score >= 35 ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-emerald-50 text-emerald-700 border-emerald-200';

            const riskLevelText =
              card.score >= 60 ? 'High' :
              card.score >= 35 ? 'Moderate' :
              'Optimal';

            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${scoreBg}`}>
                      {riskLevelText} ({card.score}%)
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mb-2 leading-tight">
                    {card.name}
                  </h4>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${progressColor}`}
                      style={{ width: `${card.score}%` }}
                    />
                  </div>

                  {/* Key Factors */}
                  {card.factors.length > 0 && (
                    <ul className="space-y-1 mb-2">
                      {card.factors.slice(0, 2).map((factor, idx) => (
                        <li key={idx} className="text-[11px] text-slate-600 flex items-start space-x-1">
                          <span className="text-slate-400 mt-0.5">•</span>
                          <span className="leading-tight">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 mt-2">
                  Stratified risk index
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
