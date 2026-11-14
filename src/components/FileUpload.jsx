import React, { useState } from 'react';
import { UploadCloud, FileText, ClipboardList, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export function FileUpload({
  onAnalyze,
  isAnalyzing,
  t,
  sampleReports,
  onSelectSample,
  currentRawText
}) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste' | 'samples'
  const [pastedText, setPastedText] = useState(currentRawText || '');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setPastedText(content);
      onAnalyze(content);
    };
    reader.readAsText(file);
  };

  const handleSubmitText = () => {
    if (pastedText.trim()) {
      onAnalyze(pastedText);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 no-print">
      
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 pt-3 space-x-2">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors border-b-2 ${
            activeTab === 'upload'
              ? 'bg-white text-clinical-700 border-clinical-600 shadow-sm'
              : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload File</span>
        </button>

        <button
          onClick={() => setActiveTab('paste')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors border-b-2 ${
            activeTab === 'paste'
              ? 'bg-white text-clinical-700 border-clinical-600 shadow-sm'
              : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Paste Lab Text</span>
        </button>

        <button
          onClick={() => setActiveTab('samples')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors border-b-2 ${
            activeTab === 'samples'
              ? 'bg-white text-clinical-700 border-clinical-600 shadow-sm'
              : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Clinical Sample Cases (5)</span>
        </button>
      </div>

      <div className="p-6">
        
        {/* Tab 1: Upload */}
        {activeTab === 'upload' && (
          <div>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-clinical-500 bg-clinical-50/50 scale-[0.99]'
                  : 'border-slate-300 hover:border-clinical-400 bg-slate-50/50'
              }`}
              onClick={() => document.getElementById('report-file-input').click()}
            >
              <input
                id="report-file-input"
                type="file"
                accept=".txt,.csv,.pdf,.json"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-clinical-50 flex items-center justify-center text-clinical-600 border border-clinical-200 shadow-inner">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-1">
                {t.dropFiles}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                {t.uploadSubtitle}
              </p>

              {uploadedFileName && (
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Loaded: <strong>{uploadedFileName}</strong></span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Paste Text */}
        {activeTab === 'paste' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
              {t.orPasteText}
            </label>
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your medical lab report text here, e.g.:&#10;Total Cholesterol: 245 mg/dL&#10;Triglycerides: 230 mg/dL&#10;HDL: 34 mg/dL&#10;LDL: 168 mg/dL&#10;Fasting Glucose: 114 mg/dL..."
              className="w-full text-xs sm:text-sm font-mono p-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-clinical-500 bg-slate-50/50 text-slate-800"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSubmitText}
                disabled={isAnalyzing || !pastedText.trim()}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-clinical-600 hover:bg-clinical-700 text-white shadow-md shadow-clinical-500/25 disabled:opacity-50 transition-all"
              >
                <span>{isAnalyzing ? t.analyzing : t.analyzeButton}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Sample Reports */}
        {activeTab === 'samples' && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select an authentic laboratory report case to inspect instant risk modeling:
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {sampleReports.map((s) => {
                const colorClasses = {
                  red: 'border-rose-200 bg-rose-50/40 hover:border-rose-400 text-rose-900',
                  amber: 'border-amber-200 bg-amber-50/40 hover:border-amber-400 text-amber-900',
                  purple: 'border-purple-200 bg-purple-50/40 hover:border-purple-400 text-purple-900',
                  orange: 'border-orange-200 bg-orange-50/40 hover:border-orange-400 text-orange-900',
                  green: 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-400 text-emerald-900'
                };
                const badgeClasses = {
                  red: 'bg-rose-100 text-rose-700 border-rose-200',
                  amber: 'bg-amber-100 text-amber-800 border-amber-200',
                  purple: 'bg-purple-100 text-purple-700 border-purple-200',
                  orange: 'bg-orange-100 text-orange-800 border-orange-200',
                  green: 'bg-emerald-100 text-emerald-700 border-emerald-200'
                };

                return (
                  <button
                    key={s.id}
                    onClick={() => onSelectSample(s.id)}
                    className={`text-left p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer flex flex-col justify-between ${
                      colorClasses[s.badgeColor] || colorClasses.green
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClasses[s.badgeColor]}`}>
                          {s.badge}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {s.patient.gender}, {s.patient.age}y
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                        {s.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {s.summary}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-clinical-600">
                      <span>Load and Interpret</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
