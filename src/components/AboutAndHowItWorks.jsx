import React from 'react';
import { Activity, ShieldAlert, HeartHandshake, CheckCircle2, Sparkles, AlertCircle, HelpCircle, ArrowRight, Zap, Award } from 'lucide-react';

export function AboutAndHowItWorks({ t }) {
  return (
    <section className="my-10 space-y-10 no-print">
      
      {/* 1. Hero / How It Works Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-clinical-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-80 h-80 bg-clinical-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-clinical-500/20 text-clinical-300 border border-clinical-400/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-clinical-400" />
            <span>{t.heroTag}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight text-white">
            {t.heroTitle}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-8">
            {t.heroSubtitle}
          </p>

          {/* 4 Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-clinical-500/20 text-clinical-300 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                {t.features.f1}
              </span>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                {t.features.f2}
              </span>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                {t.features.f3}
              </span>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                {t.features.f4}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. The Problem & Our Solution (Why We Built) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* The Problem We Saw */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 mb-4 shadow-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
              Why We Built
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {t.theProblemTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.theProblemDesc}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <span>High anxiety & inaccessible jargon overcome by AI</span>
          </div>
        </div>

        {/* Our Solution */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-clinical-50 text-clinical-600 flex items-center justify-center border border-clinical-200 mb-4 shadow-sm">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-clinical-600 uppercase tracking-wider mb-1">
              Democratizing Healthcare
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {t.ourSolutionTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.ourSolutionDesc}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center space-x-2 text-xs font-semibold text-clinical-600">
            <span>Free, instant, and accessible in Indian regional languages</span>
          </div>
        </div>

      </div>

      {/* 3. What Makes Us Different */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t.whatMakesUsDiffTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Architected for clinical rigor, patient empowerment, and Indian linguistic diversity.
            </p>
          </div>
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-clinical-700 bg-clinical-50 px-3 py-1 rounded-full border border-clinical-200 self-start sm:self-auto">
            <Award className="w-3.5 h-3.5" />
            <span>Clinical Grade Architecture</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.diffPoints.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-clinical-600 text-white flex items-center justify-center text-xs font-bold mb-3 shadow-sm">
                0{idx + 1}
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1.5 leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
