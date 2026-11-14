import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export function MedicalDisclaimer({ t }) {
  return (
    <footer className="mt-12 mb-8 bg-amber-50/70 border border-amber-200 rounded-2xl p-5 sm:p-6 text-slate-700">
      <div className="flex items-start space-x-3.5">
        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-bold text-amber-900 uppercase tracking-wider">
            {t.disclaimerTitle}
          </h4>
          <p className="text-xs leading-relaxed text-amber-800">
            {t.disclaimerText}
          </p>
          <p className="text-[11px] text-amber-700/80 italic pt-1">
            Emergency Notice: If you are experiencing chest pain, acute shortness of breath, severe dizziness, or sudden weakness, please dial emergency emergency services (e.g. 911 / 112) or visit the nearest emergency medical facility immediately.
          </p>
        </div>
      </div>
    </footer>
  );
}
