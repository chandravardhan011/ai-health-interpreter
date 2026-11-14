const STORAGE_KEY = 'ai_health_interpreter_saved_reports';

/**
 * Loads all saved reports from localStorage.
 */
export function getSavedReports() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load saved reports', e);
    return [];
  }
}

/**
 * Saves a new report to localStorage.
 */
export function saveReportToStorage(reportData) {
  try {
    const existing = getSavedReports();
    const newEntry = {
      id: 'REP-' + Date.now(),
      savedAt: new Date().toLocaleString(),
      patient: reportData.patient,
      overallIndex: reportData.overallIndex,
      overallUrgency: reportData.overallUrgency,
      rawText: reportData.rawText,
      biomarkersCount: reportData.biomarkers?.length || 0,
      abnormalCount: reportData.biomarkers?.filter(b => b.status !== 'NORMAL').length || 0
    };

    const updated = [newEntry, ...existing.slice(0, 19)]; // Keep up to 20 reports
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newEntry;
  } catch (e) {
    console.error('Failed to save report', e);
    return null;
  }
}

/**
 * Deletes a report by ID.
 */
export function deleteReportFromStorage(id) {
  try {
    const existing = getSavedReports();
    const filtered = existing.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    console.error('Failed to delete report', e);
    return [];
  }
}

/**
 * Exports all reports as a JSON backup file.
 */
export function exportReportsBackup() {
  const reports = getSavedReports();
  const blob = new Blob([JSON.stringify(reports, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `health-interpreter-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
