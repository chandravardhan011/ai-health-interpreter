import { BIOMARKER_DATABASE } from '../data/biomarkers.js';

/**
 * Extracts comprehensive patient metadata and biomarker results from medical report text.
 */
export function parseMedicalReport(rawText) {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return {
      patient: null,
      biomarkers: [],
      rawText: ''
    };
  }

  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // Extract patient metadata with advanced regex & clinical heuristics
  const patient = {
    name: 'Patient Record',
    age: 'Not specified',
    gender: 'Not specified',
    patientId: 'GEN-' + Math.floor(100000 + Math.random() * 900000),
    labName: 'Clinical Diagnostic Facility',
    reportDate: new Date().toISOString().split('T')[0],
    testPanel: 'Diagnostic Biomarker Screening',
    referringDoctor: 'Self / Primary Physician'
  };

  // 1. Extract Lab / Hospital / Clinic Name from first few header lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (/(?:LABORATORY|LAB|DIAGNOSTICS|CLINIC|HOSPITAL|PATHOLOGY|HEALTHCARE|MEDICAL CENTER|INSTITUTE|METROPOLIS|LAL PATH|APOLLO|THYROCARE)/i.test(line)) {
      patient.labName = line.replace(/^[#*=-]+\s*/, '').replace(/\s*[#*=-]+$/, '').trim();
      break;
    }
  }

  // 2. Extract Patient Name
  const nameMatch = rawText.match(/(?:PATIENT(?:\s+NAME)?|NAME|PT\.?\s*NAME)\s*[:=-]\s*([A-Za-z\s.]+?)(?=\s{2,}|AGE|GENDER|SEX|DOB|ID|REF|DATE|\n|$)/i);
  if (nameMatch && nameMatch[1].trim() && !/^(MALE|FEMALE|YEARS|YRS|AGE)$/i.test(nameMatch[1].trim())) {
    patient.name = nameMatch[1].trim().replace(/^(MR\.?|MRS\.?|MS\.?|DR\.?)\s+/i, '');
  }

  // 3. Extract Age
  const ageMatch = rawText.match(/(?:AGE|YRS|YEARS)\s*[:=-]?\s*(\d{1,3})(?:\s*(?:YRS|YEARS|Y|M))?/i);
  if (ageMatch) {
    patient.age = parseInt(ageMatch[1], 10) + ' Years';
  }

  // 4. Extract Gender / Sex
  const genderMatch = rawText.match(/(?:GENDER|SEX)\s*[:=-]\s*(MALE|FEMALE|M|F|OTHER)/i);
  if (genderMatch) {
    const g = genderMatch[1].toUpperCase();
    patient.gender = (g === 'M' || g === 'MALE') ? 'Male' : (g === 'F' || g === 'FEMALE') ? 'Female' : 'Other';
  }

  // 5. Extract Patient ID / UHID / Ref No / MRN
  const idMatch = rawText.match(/(?:PATIENT\s*ID|UHID|MRN|REF(?:ERENCE)?\s*(?:NO|ID)?|BILL\s*NO|SAMPLE\s*ID)\s*[:=-]\s*([A-Za-z0-9\-_/]+)/i);
  if (idMatch && idMatch[1].trim()) {
    patient.patientId = idMatch[1].trim();
  }

  // 6. Extract Collection / Report Date
  const dateMatch = rawText.match(/(?:COLLECTION\s*DATE|COLLECTED|REPORT\s*DATE|DATE)\s*[:=-]\s*([A-Za-z0-9\s/-]+?)(?=\s{2,}|\n|TIME|$)/i);
  if (dateMatch && dateMatch[1].trim()) {
    patient.reportDate = dateMatch[1].trim();
  }

  // 7. Extract Referring Doctor / Physician
  const docMatch = rawText.match(/(?:REF(?:ERRED)?\s*BY|DOCTOR|DR\.?|CONSULTANT)\s*[:=-]\s*([A-Za-z\s.]+?)(?=\s{2,}|\n|PATIENT|DATE|$)/i);
  if (docMatch && docMatch[1].trim()) {
    patient.referringDoctor = docMatch[1].trim();
  }

  // 8. Extract Test Panel Name / Investigation
  const panelMatch = rawText.match(/(?:TEST\s*(?:PANEL|REPORT|DESCRIPTION)|INVESTIGATION|PANEL)\s*[:=-]\s*([A-Za-z0-9\s&/()-]+?)(?=\s{2,}|\n|DATE|PATIENT|$)/i);
  if (panelMatch && panelMatch[1].trim()) {
    patient.testPanel = panelMatch[1].trim();
  }

  // Detected Biomarkers Array
  const detectedBiomarkers = [];
  const handledKeySet = new Set();
  const dbEntries = Object.values(BIOMARKER_DATABASE);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('---') || trimmed.startsWith('===')) continue;

    for (const bio of dbEntries) {
      if (handledKeySet.has(bio.id)) continue;

      const matchedAlias = bio.aliases.find(alias => {
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`\\b${escaped}\\b`, 'i');
        return pattern.test(trimmed);
      });

      if (matchedAlias) {
        const aliasIndex = trimmed.toLowerCase().indexOf(matchedAlias.toLowerCase());
        const afterAlias = trimmed.slice(aliasIndex + matchedAlias.length);

        const numMatches = [...afterAlias.matchAll(/(?:\b|(?<=\s))(\d+(?:[.,]\d+)?)(?:\b|(?=\s))/g)];

        if (numMatches.length > 0) {
          const rawNum = numMatches[0][1].replace(',', '.');
          const value = parseFloat(rawNum);

          if (!isNaN(value)) {
            handledKeySet.add(bio.id);
            const status = evaluateBiomarkerStatus(value, bio);

            detectedBiomarkers.push({
              id: bio.id,
              name: bio.name,
              category: bio.category,
              value: value,
              unit: bio.unit,
              optimalRange: bio.optimalRange,
              status: status.status,
              severity: status.severity,
              pctDeviation: status.pctDeviation,
              description: bio.description,
              clinicalNote: status.status === 'HIGH' || status.status === 'CRITICAL_HIGH' 
                ? bio.highMeaning 
                : status.status === 'LOW' || status.status === 'CRITICAL_LOW' 
                ? bio.lowMeaning 
                : 'Within optimal reference parameters.',
              lifestyleTip: bio.lifestyleTip
            });
            break;
          }
        }
      }
    }
  }

  return {
    patient,
    biomarkers: detectedBiomarkers,
    rawText
  };
}

function evaluateBiomarkerStatus(value, bio) {
  const [min, max] = bio.optimalRange;

  if (bio.criticalLow !== undefined && value <= bio.criticalLow) {
    return {
      status: 'CRITICAL_LOW',
      severity: 'critical',
      pctDeviation: Math.round(((value - min) / min) * 100)
    };
  }

  if (bio.criticalHigh !== undefined && value >= bio.criticalHigh) {
    return {
      status: 'CRITICAL_HIGH',
      severity: 'critical',
      pctDeviation: Math.round(((value - max) / max) * 100)
    };
  }

  if (value < min) {
    return {
      status: 'LOW',
      severity: 'moderate',
      pctDeviation: Math.round(((value - min) / min) * 100)
    };
  }

  if (bio.borderlineHigh !== undefined && value > max && value <= bio.borderlineHigh) {
    return {
      status: 'BORDERLINE_HIGH',
      severity: 'mild',
      pctDeviation: Math.round(((value - max) / max) * 100)
    };
  }

  if (value > max) {
    return {
      status: 'HIGH',
      severity: 'high',
      pctDeviation: Math.round(((value - max) / max) * 100)
    };
  }

  return {
    status: 'NORMAL',
    severity: 'optimal',
    pctDeviation: 0
  };
}
