import React, { useState } from 'react';
import { HelpCircle, Copy, Check, MessageSquareText } from 'lucide-react';

export function DoctorQuestions({ questions, t }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (questionText, index) => {
    navigator.clipboard.writeText(questionText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const allQuestions = questions.map((q, i) => `${i + 1}. [${q.topic}] ${q.question} (Rationale: ${q.rationale})`).join('\n\n');
    navigator.clipboard.writeText(allQuestions);
    setCopiedIndex('all');
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <MessageSquareText className="w-5 h-5 text-clinical-600" />
            <span>{t.doctorQuestionsTitle}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.doctorQuestionsDesc}
          </p>
        </div>

        <button
          onClick={handleCopyAll}
          className="no-print inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
        >
          {copiedIndex === 'all' ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">All Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy All to Phone</span>
            </>
          )}
        </button>
      </div>

      {/* Questions List */}
      <div className="p-5 space-y-4">
        {questions.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-clinical-100 text-clinical-800 text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-xs font-bold text-clinical-700 uppercase tracking-wider">
                  {item.topic}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                "{item.question}"
              </p>
              <p className="text-xs text-slate-500 italic">
                <strong className="not-italic text-slate-600 font-semibold">Clinical rationale:</strong> {item.rationale}
              </p>
            </div>

            <button
              onClick={() => handleCopy(item.question, index)}
              title="Copy question"
              className="no-print p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
            >
              {copiedIndex === index ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
