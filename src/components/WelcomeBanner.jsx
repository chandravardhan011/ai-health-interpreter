import React from 'react';
import { Activity } from 'lucide-react';

/**
 * A full‑width, centered hero banner that appears at the top of the page.
 * It gives a polished first impression of the AI Health Report Interpreter.
 */
export default function WelcomeBanner() {
  return (
    <section className="bg-gradient-to-r from-clinical-600 to-teal-500 py-12 sm:py-16 text-center text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-4">
        <Activity className="w-12 h-12 animate-pulse" />
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          AI Health Report Interpreter
        </h1>
        <p className="text-sm sm:text-base max-w-lg">
          Medical Lab Analysis &amp; Multilingual Risk Predictor – upload a report, get a clear explanation and risk assessment instantly.
        </p>
      </div>
    </section>
  );
}
