import { BIOMARKER_DATABASE } from '../data/biomarkers.js';

/**
 * Extracts patient details and biomarker results from raw medical report text.
 */
export function parseMedicalReport(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      patient: { name: 'Patient', age: 'Unknown', gender: 'Unknown', date: new Date().toLocaleDateString() },
      biomarkers: [],
      rawText: ''
    };
  }

  const lines = rawText.split(/\r?\n/);

  // Extract patient metadata if available
  const patient = {
    name: 'Patient',
    age: 'Unknown',
    gender: 'Unknown',
    date: new Date().toISOString().split('T')[0]
  };

  const nameMatch = rawText.match(/(?:PATIENT(?: NAME)?|NAME)\s*[:=-]\s*([A-Za-z\s.]+?)(?=\s{2,}|AGE|GENDER|SEX|\n|$)/i);
  if (nameMatch && nameMatch[1].trim()) {
    patient.name = nameMatch[1].trim();
  }

  const ageMatch = rawText.match(/AGE\s*[:=-]\s*(\d{1,3})/i);
  if (ageMatch) {
    patient.age = parseInt(ageMatch[1], 10);
  }

  const genderMatch = rawText.match(/(?:GENDER|SEX)\s*[:=-]\s*(MALE|FEMALE|M|F|OTHER)/i);
  if (genderMatch) {
    const g = genderMatch[1].toUpperCase();
    patient.gender = (g === 'M' || g === 'MALE') ? 'Male' : (g === 'F' || g === 'FEMALE') ? 'Female' : 'Other';
  }

  const dateMatch = rawText.match(/(?:DATE|COLLECTION DATE|COLLECTED)\s*[:=-]\s*([A-Za-z0-9\s/-]+?)(?=\s{2,}|\n|$)/i);
  if (dateMatch && dateMatch[1].trim()) {
    patient.date = dateMatch[1].trim();
  }

  // Detected Biomarkers Array
  const detectedBiomarkers = [];
  const handledKeySet = new Set();

  // Biomarker database keys
  const dbEntries = Object.values(BIOMARKER_DATABASE);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('---') || trimmed.startsWith('===')) continue;

    // Check each biomarker definition
    for (const bio of dbEntries) {
      if (handledKeySet.has(bio.id)) continue;

      // Check if any alias matches this line
      const matchedAlias = bio.aliases.find(alias => {
        // Look for alias at word boundary
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`\\b${escaped}\\b`, 'i');
        return pattern.test(trimmed);
      });

      if (matchedAlias) {
        // Extract the numerical value from the line
        // Pattern matches numbers like 14.8, 168, 6800, 0.85
        // We look for numbers after the matched alias
        const aliasIndex = trimmed.toLowerCase().indexOf(matchedAlias.toLowerCase());
        const afterAlias = trimmed.slice(aliasIndex + matchedAlias.length);

        // Find numbers in afterAlias (allow decimals and commas)
        const numMatches = [...afterAlias.matchAll(/(?:\b|(?<=\s))(\d+(?:[.,]\d+)?)(?:\b|(?=\s))/g)];

        if (numMatches.length > 0) {
          // Usually the first valid number after test name is the observed value
          const rawNum = numMatches[0][1].replace(',', '.');
          const value = parseFloat(rawNum);

          if (!isNaN(value)) {
            handledKeySet.add(bio.id);

            // Determine status
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

/**
 * Evaluates whether a biomarker is Low, Normal, High, or Critical.
 */
function evaluateBiomarkerStatus(value, bio) {
  const [min, max] = bio.optimalRange;

  // Check critical thresholds if available
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
