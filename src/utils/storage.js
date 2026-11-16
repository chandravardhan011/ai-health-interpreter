// Firebase Firestore Storage with automatic LocalStorage / IndexedDB fallback
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebaseConfig";

const LOCAL_STORAGE_KEY = 'ai_health_interpreter_saved_reports';

function getLocalReports() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalReport(entry) {
  try {
    const existing = getLocalReports();
    const updated = [entry, ...existing.filter(r => r.id !== entry.id).slice(0, 19)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }
}

function deleteLocalReport(id) {
  try {
    const existing = getLocalReports();
    const filtered = existing.filter(r => r.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    return [];
  }
}

/**
 * Loads up to 20 most recent reports from Firebase Firestore.
 * Automatically falls back to LocalStorage if Firestore credentials are unconfigured or offline.
 */
export async function getSavedReports() {
  const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_PROJECT_ID && 
                               !import.meta.env.VITE_FIREBASE_PROJECT_ID.includes('your_project_id');

  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "reports"), orderBy("savedAt", "desc"), limit(20));
      const snapshot = await getDocs(q);
      const reports = [];
      snapshot.forEach((docSnap) => {
        reports.push({ id: docSnap.id, ...docSnap.data() });
      });
      return reports;
    } catch (e) {
      console.warn("Firestore query failed, using local browser fallback:", e);
      return getLocalReports();
    }
  }

  return getLocalReports();
}

/**
 * Saves a new report to Firestore with LocalStorage mirror.
 */
export async function saveReportToStorage(reportData) {
  const newEntry = {
    id: 'REP-' + Date.now(),
    savedAt: new Date().toISOString(),
    patient: reportData.patient,
    overallIndex: reportData.overallIndex,
    overallUrgency: reportData.overallUrgency,
    rawText: reportData.rawText,
    biomarkersCount: reportData.biomarkers?.length || 0,
    abnormalCount: reportData.biomarkers?.filter(b => b.status !== "NORMAL").length || 0,
  };

  // Always mirror in LocalStorage for 100% offline availability
  saveLocalReport(newEntry);

  const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_PROJECT_ID && 
                               !import.meta.env.VITE_FIREBASE_PROJECT_ID.includes('your_project_id');

  if (isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, "reports"), newEntry);
      return { ...newEntry, id: docRef.id };
    } catch (e) {
      console.warn("Firestore save failed, saved locally instead:", e);
      return newEntry;
    }
  }

  return newEntry;
}

/**
 * Deletes a report document by its Firestore or LocalStorage id.
 */
export async function deleteReportFromStorage(id) {
  deleteLocalReport(id);

  const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_PROJECT_ID && 
                               !import.meta.env.VITE_FIREBASE_PROJECT_ID.includes('your_project_id');

  if (isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, "reports", id));
      return true;
    } catch (e) {
      console.warn("Firestore delete failed:", e);
      return false;
    }
  }

  return true;
}

/**
 * Exports all reports as a JSON backup file.
 */
export async function exportReportsBackup() {
  const reports = await getSavedReports();
  const blob = new Blob([JSON.stringify(reports, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `health-interpreter-backup-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
