import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.jsx';
import { FileUpload } from './components/FileUpload.jsx';
import { PatientDetailsCard } from './components/PatientDetailsCard.jsx';
import { RiskOverview } from './components/RiskOverview.jsx';
import { BiomarkerTable } from './components/BiomarkerTable.jsx';
import { DoctorQuestions } from './components/DoctorQuestions.jsx';
import { LifestyleAdvice } from './components/LifestyleAdvice.jsx';
import { AIAssistantChat } from './components/AIAssistantChat.jsx';
import { AboutAndHowItWorks } from './components/AboutAndHowItWorks.jsx';
import { MedicalDisclaimer } from './components/MedicalDisclaimer.jsx';
import { SavedReportsDrawer } from './components/SavedReportsDrawer.jsx';
import { HostingGuideModal } from './components/HostingGuideModal.jsx';

import { TRANSLATIONS, SUPPORTED_LANGUAGES } from './data/translations.js';
import { parseMedicalReport } from './utils/reportParser.js';
import { calculateHealthRisks } from './utils/riskEngine.js';
import { speakReportSummary, stopSpeech, isSpeaking } from './utils/speech.js';
import { getSavedReports, saveReportToStorage, deleteReportFromStorage } from './utils/storage.js';

export function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [currentRawText, setCurrentRawText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isHostingGuideOpen, setIsHostingGuideOpen] = useState(false);
  const [savedReports, setSavedReports] = useState([]);
  const [isCurrentSaved, setIsCurrentSaved] = useState(false);
  const [customPatient, setCustomPatient] = useState(null);

  // Active translation dictionary
  const t = useMemo(() => {
    return TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  }, [currentLang]);

  // Load saved reports on mount
  useEffect(() => {
    setSavedReports(getSavedReports());
  }, []);

  // Parse report and calculate risks
  const { parsedData, riskData } = useMemo(() => {
    if (!currentRawText.trim()) {
      return { parsedData: { patient: null, biomarkers: [] }, riskData: null };
    }
    const parsed = parseMedicalReport(currentRawText);
    const effectivePatient = customPatient || parsed.patient;
    const risks = calculateHealthRisks(parsed.biomarkers, effectivePatient);
    return {
      parsedData: {
        ...parsed,
        patient: effectivePatient
      },
      riskData: risks
    };
  }, [currentRawText, customPatient]);

  // Handle report analysis
  const handleAnalyze = (newText) => {
    setIsAnalyzing(true);
    stopSpeech();
    setIsAudioPlaying(false);
    setCustomPatient(null);
    setIsCurrentSaved(false);

    setTimeout(() => {
      setCurrentRawText(newText);
      setIsAnalyzing(false);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }, 450);
  };

  // Handle manual patient detail update
  const handleUpdatePatient = (updatedPatient) => {
    setCustomPatient(updatedPatient);
  };

  // Save report to localStorage
  const handleSaveReport = () => {
    if (!riskData || !parsedData.patient) return;
    const saved = saveReportToStorage({
      patient: parsedData.patient,
      overallIndex: riskData.overallIndex,
      overallUrgency: riskData.overallUrgency,
      rawText: currentRawText,
      biomarkers: parsedData.biomarkers
    });
    if (saved) {
      setSavedReports(getSavedReports());
      setIsCurrentSaved(true);
    }
  };

  // Delete saved report
  const handleDeleteReport = (id) => {
    const updated = deleteReportFromStorage(id);
    setSavedReports(updated);
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
      const patientName = parsedData.patient?.name || 'Patient';
      const summaryText = riskData ? riskData.clinicalSummary : t.heroSubtitle;
      const spokenText = `${t.appTitle}. ${patientName}. ${riskData ? `${t.overallScore}: ${riskData.overallIndex} out of 100.` : ''} ${summaryText}`;
      
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

  const hasAnalysis = Boolean(riskData && parsedData.biomarkers.length > 0);

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
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        savedReportsCount={savedReports.length}
        onOpenHostingGuide={() => setIsHostingGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Upload Zone (No default sample pre-loaded) */}
        <FileUpload
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          t={t}
          currentRawText={currentRawText}
        />

        {/* When Report is Uploaded: Show Patient Details, Health Index, Biomarkers & Risk Predictions */}
        {hasAnalysis ? (
          <div>
            
            {/* 1. Patient Name and Extracted Details Card */}
            <PatientDetailsCard
              patient={parsedData.patient}
              onUpdatePatient={handleUpdatePatient}
              t={t}
            />

            {/* 2. Visual Risk & Health Score Overview */}
            <RiskOverview
              patient={parsedData.patient}
              overallIndex={riskData.overallIndex}
              overallUrgency={riskData.overallUrgency}
              clinicalSummary={riskData.clinicalSummary}
              risks={riskData.risks}
              onSaveReport={handleSaveReport}
              isSaved={isCurrentSaved}
              t={t}
            />

            {/* 3. Biomarkers Table & Visual Range Gauges */}
            <BiomarkerTable
              biomarkers={parsedData.biomarkers}
              t={t}
            />

            {/* 4. Actionable Doctor Questions */}
            <DoctorQuestions
              questions={riskData.doctorQuestions}
              t={t}
            />

            {/* 5. Evidence-Based Lifestyle & Nutrition Guidance */}
            <LifestyleAdvice
              recommendations={riskData.lifestyleRecommendations}
              t={t}
            />

            {/* 6. Interactive AI Health Assistant Chat */}
            <AIAssistantChat
              biomarkers={parsedData.biomarkers}
              patient={parsedData.patient}
              risks={riskData.risks}
              t={t}
            />

          </div>
        ) : null}

        {/* How It Works, Why We Built, The Problem, Our Solution, What Makes Us Different */}
        <AboutAndHowItWorks t={t} />

        {/* Persistent Clinical Safety Disclaimer */}
        <MedicalDisclaimer t={t} />

      </main>

      {/* Saved Reports Drawer */}
      <SavedReportsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        reports={savedReports}
        onSelectReport={(raw) => handleAnalyze(raw)}
        onDeleteReport={handleDeleteReport}
        t={t}
      />

      {/* Full Hosting & Cloud Storage Guide Modal */}
      <HostingGuideModal
        isOpen={isHostingGuideOpen}
        onClose={() => setIsHostingGuideOpen(false)}
      />

    </div>
  );
}

export default App;
