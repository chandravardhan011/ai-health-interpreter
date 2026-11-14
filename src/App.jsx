import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.jsx';
import { FileUpload } from './components/FileUpload.jsx';
import { RiskOverview } from './components/RiskOverview.jsx';
import { BiomarkerTable } from './components/BiomarkerTable.jsx';
import { DoctorQuestions } from './components/DoctorQuestions.jsx';
import { LifestyleAdvice } from './components/LifestyleAdvice.jsx';
import { AIAssistantChat } from './components/AIAssistantChat.jsx';
import { MedicalDisclaimer } from './components/MedicalDisclaimer.jsx';

import { SAMPLE_REPORTS } from './data/sampleReports.js';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from './data/translations.js';
import { parseMedicalReport } from './utils/reportParser.js';
import { calculateHealthRisks } from './utils/riskEngine.js';
import { speakReportSummary, stopSpeech, isSpeaking } from './utils/speech.js';

export function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [currentRawText, setCurrentRawText] = useState(SAMPLE_REPORTS[0].rawText);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Active translation dictionary
  const t = useMemo(() => {
    return TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  }, [currentLang]);

  // Parse report and calculate risks
  const { parsedData, riskData } = useMemo(() => {
    const parsed = parseMedicalReport(currentRawText);
    const risks = calculateHealthRisks(parsed.biomarkers, parsed.patient);
    return { parsedData: parsed, riskData: risks };
  }, [currentRawText]);

  // Handle report analysis
  const handleAnalyze = (newText) => {
    setIsAnalyzing(true);
    stopSpeech();
    setIsAudioPlaying(false);

    setTimeout(() => {
      setCurrentRawText(newText);
      setIsAnalyzing(false);
    }, 400);
  };

  // Select sample case
  const handleSelectSample = (sampleId) => {
    const sample = SAMPLE_REPORTS.find(s => s.id === sampleId);
    if (sample) {
      handleAnalyze(sample.rawText);
    }
  };

  // Language Change
  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    stopSpeech();
    setIsAudioPlaying(false);
  };

  // Text-To-Speech Toggle
  const handleToggleSpeech = () => {
    if (isAudioPlaying) {
      stopSpeech();
      setIsAudioPlaying(false);
    } else {
      const langConfig = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || { voiceLang: 'en-US' };
      const spokenText = `${t.appTitle}. ${t.overallScore}: ${riskData.overallIndex} out of 100. Status: ${riskData.overallUrgency}. ${riskData.clinicalSummary}`;
      
      speakReportSummary(
        spokenText,
        langConfig.voiceLang,
        () => setIsAudioPlaying(true),
        () => setIsAudioPlaying(false)
      );
    }
  };

  // Print Patient Consultation Sheet
  const handlePrint = () => {
    window.print();
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => stopSpeech();
  }, []);

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${currentLang === 'ar' ? 'rtl' : 'ltr'}`}>
      
      {/* Top Sticky Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        t={t}
        onPrint={handlePrint}
        onToggleSpeech={handleToggleSpeech}
        isAudioPlaying={isAudioPlaying}
        sampleReports={SAMPLE_REPORTS}
        onSelectSample={handleSelectSample}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Upload & Clinical Samples Drawer */}
        <FileUpload
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          t={t}
          sampleReports={SAMPLE_REPORTS}
          onSelectSample={handleSelectSample}
          currentRawText={currentRawText}
        />

        {/* Visual Risk & Clinical Summary Section */}
        <RiskOverview
          patient={parsedData.patient}
          overallIndex={riskData.overallIndex}
          overallUrgency={riskData.overallUrgency}
          clinicalSummary={riskData.clinicalSummary}
          risks={riskData.risks}
          t={t}
        />

        {/* Extracted Biomarkers Table & Visual Range Gauges */}
        <BiomarkerTable
          biomarkers={parsedData.biomarkers}
          t={t}
        />

        {/* Actionable Doctor Questions */}
        <DoctorQuestions
          questions={riskData.doctorQuestions}
          t={t}
        />

        {/* Evidence-Based Lifestyle & Nutrition Guidance */}
        <LifestyleAdvice
          recommendations={riskData.lifestyleRecommendations}
          t={t}
        />

        {/* Interactive AI Health Assistant Chat */}
        <AIAssistantChat
          biomarkers={parsedData.biomarkers}
          patient={parsedData.patient}
          risks={riskData.risks}
          t={t}
        />

        {/* Persistent Clinical Disclaimer */}
        <MedicalDisclaimer t={t} />

      </main>

    </div>
  );
}
export default App;
