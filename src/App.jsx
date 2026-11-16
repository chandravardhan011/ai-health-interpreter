import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.jsx';
import { FileUpload } from './components/FileUpload.jsx';
import { PatientDetailsCard } from './components/PatientDetailsCard.jsx';
import { ExecutiveSummary } from './components/ExecutiveSummary.jsx';
import { RiskOverview } from './components/RiskOverview.jsx';
import { BiomarkerTable } from './components/BiomarkerTable.jsx';
import { DoctorQuestions } from './components/DoctorQuestions.jsx';
import { LifestyleAdvice } from './components/LifestyleAdvice.jsx';
import { AIAssistantChat } from './components/AIAssistantChat.jsx';
import { AboutAndHowItWorks } from './components/AboutAndHowItWorks.jsx';
import { MedicalDisclaimer } from './components/MedicalDisclaimer.jsx';
import { SavedReportsDrawer } from './components/SavedReportsDrawer.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import WelcomeBanner from './components/WelcomeBanner.jsx';

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('health_user') || 'null');
    } catch {
      return null;
    }
  });
  const [savedReports, setSavedReports] = useState([]);
  const [isCurrentSaved, setIsCurrentSaved] = useState(false);
  const [customPatient, setCustomPatient] = useState(null);

  // Active translation dictionary
  const t = useMemo(() => {
    return TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  }, [currentLang]);

  // Load saved reports on mount
  useEffect(() => {
    async function loadReports() {
      const reports = await getSavedReports();
      setSavedReports(reports);
    }
    loadReports();
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
      const parsed = parseMedicalReport(newText);
      if (parsed.biomarkers.length > 0) {
        window.scrollTo({ top: 380, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    }, 450);
  };

  // Handle manual patient detail update
  const handleUpdatePatient = (updatedPatient) => {
    setCustomPatient(updatedPatient);
  };

  // Save report to storage
  const handleSaveReport = async () => {
    if (!riskData || !parsedData.patient) return;
    const saved = await saveReportToStorage({
      patient: parsedData.patient,
      overallIndex: riskData.overallIndex,
      overallUrgency: riskData.overallUrgency,
      rawText: currentRawText,
      biomarkers: parsedData.biomarkers
    });
    if (saved) {
      const refreshed = await getSavedReports();
      setSavedReports(refreshed);
      setIsCurrentSaved(true);
    }
  };

  // Delete saved report
  const handleDeleteReport = async (id) => {
    await deleteReportFromStorage(id);
    const refreshed = await getSavedReports();
    setSavedReports(refreshed);
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

  // Handle User Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('health_user');
  };

  // Handle User Login
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
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
  const hasAttemptedAnalysis = Boolean(currentRawText && currentRawText.trim() && !hasAnalysis);

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
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Hero Welcome Banner */}
      <WelcomeBanner />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Upload Zone */}
        <FileUpload
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          t={t}
          currentRawText={currentRawText}
        />

        {/* Feedback if file was uploaded but no clinical biomarkers were found */}
        {hasAttemptedAnalysis && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm mb-8 text-center max-w-2xl mx-auto animate-fadeIn">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-xl font-bold">
              ⚠️
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
              No Numerical Lab Biomarkers Recognized in this File
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              We could not find recognized clinical test names and numbers (e.g. Hemoglobin, Glucose, Creatinine) in the uploaded document. If this was a scanned image or photo, please copy the text and paste it into the <strong>"Or Paste Plain Report Text"</strong> tab above.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl text-left font-mono text-[11px] text-slate-600 max-h-28 overflow-y-auto mb-4 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Extracted Text Preview:</div>
              {currentRawText.slice(0, 300) || '(No readable text extracted)'}
            </div>
          </div>
        )}

        {/* When Report is Uploaded */}
        {hasAnalysis ? (
          <ErrorBoundary>
            <div>
              {/* 1. Patient Details Card */}
              <PatientDetailsCard
                patient={parsedData.patient}
                onUpdatePatient={handleUpdatePatient}
                t={t}
              />

              {/* 2. Executive Health Summary */}
              <ExecutiveSummary
                patient={parsedData.patient}
                biomarkers={parsedData.biomarkers}
                diagnosticFindings={parsedData.diagnosticFindings}
                overallIndex={riskData.overallIndex}
                clinicalSummary={riskData.clinicalSummary}
                onPrint={handlePrint}
                t={t}
              />

              {/* 3. Visual Risk Overview */}
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

              {/* 4. Biomarkers Table */}
              <BiomarkerTable
                biomarkers={parsedData.biomarkers}
                t={t}
              />

              {/* 5. Doctor Questions */}
              <DoctorQuestions
                questions={riskData.doctorQuestions}
                t={t}
              />

              {/* 6. Lifestyle Advice */}
              <LifestyleAdvice
                recommendations={riskData.lifestyleRecommendations}
                t={t}
              />

              {/* 7. AI Health Assistant Chat */}
              <AIAssistantChat
                biomarkers={parsedData.biomarkers}
                patient={parsedData.patient}
                risks={riskData.risks}
                t={t}
              />
            </div>
          </ErrorBoundary>
        ) : null}

        {/* How It Works */}
        <AboutAndHowItWorks t={t} />

        {/* Safety Disclaimer */}
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

      {/* User Authentication & Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}

export default App;
