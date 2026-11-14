/**
 * Multi-Disease Predictive Health Risk Engine & Clinical Synthesizer
 */

export function calculateHealthRisks(biomarkers, patient = {}) {
  const bioMap = {};
  biomarkers.forEach(b => {
    bioMap[b.id] = b;
  });

  // 1. Cardiovascular Atherogenic Risk (0 - 100)
  let cardioScore = 15; // baseline low risk
  const cardioFactors = [];

  const ldl = bioMap['LDL_CHOLESTEROL']?.value;
  const tc = bioMap['TOTAL_CHOLESTEROL']?.value;
  const hdl = bioMap['HDL_CHOLESTEROL']?.value;
  const tg = bioMap['TRIGLYCERIDES']?.value;
  const cholRatio = bioMap['CHOL_HDL_RATIO']?.value;

  if (ldl) {
    if (ldl >= 160) { cardioScore += 35; cardioFactors.push('Significantly elevated LDL (atherogenic cholesterol)'); }
    else if (ldl >= 130) { cardioScore += 20; cardioFactors.push('Elevated LDL cholesterol'); }
    else if (ldl >= 100) { cardioScore += 10; cardioFactors.push('Borderline LDL level'); }
  }

  if (tc) {
    if (tc >= 240) { cardioScore += 20; cardioFactors.push('High Total Serum Cholesterol'); }
    else if (tc >= 200) { cardioScore += 10; cardioFactors.push('Borderline high Total Cholesterol'); }
  }

  if (hdl) {
    if (hdl < 40) { cardioScore += 20; cardioFactors.push('Low protective HDL cholesterol'); }
    else if (hdl >= 60) { cardioScore -= 10; cardioFactors.push('Optimal protective HDL levels'); }
  }

  if (tg) {
    if (tg >= 200) { cardioScore += 15; cardioFactors.push('Elevated blood triglycerides'); }
    else if (tg >= 150) { cardioScore += 8; cardioFactors.push('Borderline triglycerides'); }
  }

  if (cholRatio && cholRatio > 5.0) {
    cardioScore += 15;
    cardioFactors.push('Unfavorable Total Cholesterol / HDL ratio');
  }

  cardioScore = Math.min(Math.max(cardioScore, 5), 98);

  // 2. Type-2 Diabetes & Metabolic Risk (0 - 100)
  let metabolicScore = 12;
  const metabolicFactors = [];

  const hba1c = bioMap['HBA1C']?.value;
  const fbs = bioMap['FASTING_GLUCOSE']?.value;

  if (hba1c) {
    if (hba1c >= 8.0) { metabolicScore += 65; metabolicFactors.push(`Critical Glycated Hemoglobin (HbA1c ${hba1c}% indicates persistent hyperglycemia)`); }
    else if (hba1c >= 6.5) { metabolicScore += 50; metabolicFactors.push(`HbA1c ${hba1c}% meets clinical threshold for Diabetes Mellitus`); }
    else if (hba1c >= 5.7) { metabolicScore += 25; metabolicFactors.push(`HbA1c ${hba1c}% indicates Pre-diabetes`); }
    else { metabolicFactors.push('HbA1c in normal glycemic range'); }
  }

  if (fbs) {
    if (fbs >= 126) { metabolicScore += 35; metabolicFactors.push(`Fasting Glucose (${fbs} mg/dL) exceeds diabetes threshold`); }
    else if (fbs >= 100) { metabolicScore += 18; metabolicFactors.push(`Impaired Fasting Glucose (${fbs} mg/dL) indicating insulin resistance`); }
  }

  if (tg && tg >= 200) {
    metabolicScore += 10;
    metabolicFactors.push('Hypertriglyceridemia associated with insulin resistance');
  }

  metabolicScore = Math.min(Math.max(metabolicScore, 5), 98);

  // 3. Kidney (Renal) Risk (0 - 100)
  let kidneyScore = 10;
  const kidneyFactors = [];

  const egfr = bioMap['EGFR']?.value;
  const creat = bioMap['SERUM_CREATININE']?.value;
  const bun = bioMap['BUN']?.value;
  const uric = bioMap['URIC_ACID']?.value;

  if (egfr) {
    if (egfr < 30) { kidneyScore += 70; kidneyFactors.push('Severe reduction in glomerular filtration rate (< 30 mL/min)'); }
    else if (egfr < 60) { kidneyScore += 45; kidneyFactors.push('eGFR below 60 mL/min indicates moderate Chronic Kidney Disease (CKD)'); }
    else if (egfr < 90) { kidneyScore += 15; kidneyFactors.push('Mildly decreased eGFR'); }
    else { kidneyFactors.push('Optimal kidney filtration rate'); }
  }

  if (creat) {
    if (creat >= 2.0) { kidneyScore += 35; kidneyFactors.push('Elevated Serum Creatinine indicates impaired renal excretion'); }
    else if (creat > 1.2) { kidneyScore += 20; kidneyFactors.push('Serum Creatinine above normal baseline'); }
  }

  if (bun && bun > 20) {
    kidneyScore += 12;
    kidneyFactors.push('Elevated Blood Urea Nitrogen (BUN)');
  }

  if (uric && uric > 7.2) {
    kidneyScore += 10;
    kidneyFactors.push('Elevated Uric Acid (Hyperuricemia / gout risk)');
  }

  kidneyScore = Math.min(Math.max(kidneyScore, 5), 98);

  // 4. Liver (Hepatic) Function Risk (0 - 100)
  let liverScore = 10;
  const liverFactors = [];

  const alt = bioMap['ALT']?.value;
  const ast = bioMap['AST']?.value;
  const bili = bioMap['TOTAL_BILIRUBIN']?.value;
  const alp = bioMap['ALKALINE_PHOSPHATASE']?.value;
  const alb = bioMap['ALBUMIN']?.value;

  if (alt) {
    if (alt >= 100) { liverScore += 45; liverFactors.push('Significantly high ALT indicates active liver inflammation'); }
    else if (alt > 45) { liverScore += 25; liverFactors.push('Elevated ALT transaminase enzyme'); }
  }

  if (ast) {
    if (ast >= 100) { liverScore += 30; liverFactors.push('High AST transaminase'); }
    else if (ast > 40) { liverScore += 18; liverFactors.push('Elevated AST'); }
  }

  if (bili && bili > 1.2) {
    liverScore += 20;
    liverFactors.push('Elevated Total Bilirubin (bile excretion / hemolysis flag)');
  }

  if (alp && alp > 147) {
    liverScore += 15;
    liverFactors.push('Elevated Alkaline Phosphatase (biliary or bone involvement)');
  }

  if (alb && alb < 3.5) {
    liverScore += 20;
    liverFactors.push('Low Serum Albumin indicates reduced hepatic synthesis or protein loss');
  }

  liverScore = Math.min(Math.max(liverScore, 5), 98);

  // 5. Hematology & Anemia Risk (0 - 100)
  let anemiaScore = 10;
  const anemiaFactors = [];

  const hb = bioMap['HEMOGLOBIN']?.value;
  const mcv = bioMap['MCV']?.value;
  const ferritin = bioMap['SERUM_FERRITIN']?.value;
  const wbc = bioMap['WBC_COUNT']?.value;
  const plt = bioMap['PLATELET_COUNT']?.value;

  if (hb) {
    if (hb < 10.0) { anemiaScore += 60; anemiaFactors.push(`Critical Hemoglobin (${hb} g/dL): Moderate-to-severe Anemia`); }
    else if (hb < 12.0) { anemiaScore += 35; anemiaFactors.push(`Low Hemoglobin (${hb} g/dL): Mild Anemia`); }
    else { anemiaFactors.push('Hemoglobin level in healthy oxygen-carrying range'); }
  }

  if (ferritin && ferritin < 15) {
    anemiaScore += 30;
    anemiaFactors.push('Severely depleted iron stores (Serum Ferritin < 15 ng/mL)');
  }

  if (mcv) {
    if (mcv < 80) { anemiaScore += 15; anemiaFactors.push('Microcytosis (small red blood cells, common in iron deficiency)'); }
    else if (mcv > 100) { anemiaScore += 15; anemiaFactors.push('Macrocytosis (large red blood cells, common in B12/folate deficiency)'); }
  }

  if (wbc) {
    if (wbc > 11000) { anemiaScore += 15; anemiaFactors.push('Elevated WBC suggests acute infection or inflammation'); }
    else if (wbc < 4000) { anemiaScore += 20; anemiaFactors.push('Low WBC (leukopenia) indicates reduced immune reserve'); }
  }

  if (plt && plt < 150) {
    anemiaScore += 20;
    anemiaFactors.push('Thrombocytopenia (low platelets) can increase bruising or bleeding tendencies');
  }

  anemiaScore = Math.min(Math.max(anemiaScore, 5), 98);

  // Overall Health Index (100 is perfect, penalties reduce it)
  const maxRisk = Math.max(cardioScore, metabolicScore, kidneyScore, liverScore, anemiaScore);
  const avgRisk = (cardioScore + metabolicScore + kidneyScore + liverScore + anemiaScore) / 5;
  const penalty = (maxRisk * 0.6) + (avgRisk * 0.4);
  const overallIndex = Math.max(Math.round(100 - penalty + 10), 15);

  // Determine overall severity
  let overallUrgency = 'optimal';
  if (overallIndex < 40 || maxRisk >= 70) {
    overallUrgency = 'critical';
  } else if (overallIndex < 60 || maxRisk >= 50) {
    overallUrgency = 'high';
  } else if (overallIndex < 75 || maxRisk >= 35) {
    overallUrgency = 'moderate';
  } else if (overallIndex < 88) {
    overallUrgency = 'low';
  }

  // Generate Doctor Questions
  const doctorQuestions = generateDoctorQuestions(biomarkers, {
    cardioScore,
    metabolicScore,
    kidneyScore,
    liverScore,
    anemiaScore
  });

  // Generate Lifestyle & Diet Recommendations
  const lifestyleRecommendations = generateLifestyleRecommendations(biomarkers, {
    cardioScore,
    metabolicScore,
    kidneyScore,
    liverScore,
    anemiaScore
  });

  // Clinical Summary Text
  const clinicalSummary = generateClinicalSummary(overallUrgency, overallIndex, {
    cardioScore,
    metabolicScore,
    kidneyScore,
    liverScore,
    anemiaScore
  }, biomarkers);

  return {
    overallIndex,
    overallUrgency,
    clinicalSummary,
    risks: {
      cardio: { score: cardioScore, factors: cardioFactors },
      metabolic: { score: metabolicScore, factors: metabolicFactors },
      kidney: { score: kidneyScore, factors: kidneyFactors },
      liver: { score: liverScore, factors: liverFactors },
      anemia: { score: anemiaScore, factors: anemiaFactors }
    },
    doctorQuestions,
    lifestyleRecommendations
  };
}

function generateClinicalSummary(urgency, score, riskScores, biomarkers) {
  const abnormalCount = biomarkers.filter(b => b.status !== 'NORMAL').length;
  const criticalCount = biomarkers.filter(b => b.status === 'CRITICAL_HIGH' || b.status === 'CRITICAL_LOW').length;

  if (urgency === 'optimal') {
    return 'Your laboratory biomarkers reflect excellent physiological stability. Cardiac lipids, metabolic glycemic indices, renal clearance, and liver enzymes all reside within optimal standard reference intervals. Continue your preventative wellness routines.';
  }

  const primaryConcerns = [];
  if (riskScores.cardioScore >= 40) primaryConcerns.push('atherogenic cardiovascular lipid burden');
  if (riskScores.metabolicScore >= 40) primaryConcerns.push('impaired glycemic regulation / diabetes risk');
  if (riskScores.kidneyScore >= 40) primaryConcerns.push('decreased renal filtration rate');
  if (riskScores.liverScore >= 40) primaryConcerns.push('hepatocellular liver transaminase stress');
  if (riskScores.anemiaScore >= 40) primaryConcerns.push('hematologic oxygenation deficit / anemia');

  const concernsText = primaryConcerns.length > 0 
    ? `The primary focal areas identified are: ${primaryConcerns.join(', ')}.`
    : 'Mild variances across isolated biomarkers were observed.';

  return `Analysis identified ${abnormalCount} biomarker(s) outside optimal ranges${criticalCount > 0 ? `, including ${criticalCount} critical flag(s)` : ''}. ${concernsText} A structured review with your physician is strongly recommended to confirm diagnoses, adjust therapeutic management, and repeat confirmatory panels.`;
}

function generateDoctorQuestions(biomarkers, riskScores) {
  const questions = [];

  if (riskScores.cardioScore >= 40) {
    questions.push({
      topic: 'Cardiovascular & Lipids',
      question: 'Given my elevated LDL / Total Cholesterol and lipid ratios, would you recommend initiating lipid-lowering therapy (e.g., statins) or would you prefer a 3-month trial of targeted cardiovascular nutrition?',
      rationale: 'Clarifies whether medical pharmacotherapy or lifestyle modification is the appropriate first line.'
    });
    questions.push({
      topic: 'Coronary Calcium & Advanced Lipids',
      question: 'Should we perform a Coronary Artery Calcium (CAC) scan or check Apolipoprotein B (ApoB) and hs-CRP to more precisely gauge arterial plaque risk?',
      rationale: 'Advanced biomarkers provide deeper insight than standard lipid panels alone.'
    });
  }

  if (riskScores.metabolicScore >= 40) {
    questions.push({
      topic: 'Diabetes & Glucose Control',
      question: 'My HbA1c / fasting glucose indicates significant insulin resistance or diabetes. What target HbA1c goal should we establish for the next 90 days?',
      rationale: 'Establishes clear clinical targets to monitor therapeutic efficacy.'
    });
    questions.push({
      topic: 'Diabetic Screenings',
      question: 'Do I need baseline referrals for an annual dilated retinal eye exam and urine microalbumin-to-creatinine ratio (ACR) to protect my kidneys and vision?',
      rationale: 'Essential standard-of-care preventative screenings for elevated glycemic markers.'
    });
  }

  if (riskScores.kidneyScore >= 35) {
    questions.push({
      topic: 'Renal Function',
      question: 'My eGFR and creatinine indicate decreased filtration. Could any current medications, supplements, or dehydration be contributing, and should we repeat this test in 6 weeks?',
      rationale: 'Differentiates acute transient kidney stress from chronic renal decline.'
    });
  }

  if (riskScores.liverScore >= 35) {
    questions.push({
      topic: 'Liver Enzymes',
      question: 'My ALT / AST transaminases are elevated. Would you advise an abdominal ultrasound to evaluate for fatty liver infiltration (hepatic steatosis) or biliary involvement?',
      rationale: 'Ultrasound is the non-invasive first-line imaging modality for liver enzyme elevation.'
    });
  }

  if (riskScores.anemiaScore >= 35) {
    questions.push({
      topic: 'Hematology & Anemia',
      question: 'With my low hemoglobin / ferritin, what form of iron supplementation (oral iron bisglycinate vs. infusion) is best suited for me, and should we evaluate for any hidden blood loss?',
      rationale: 'Determines the root etiology of iron depletion and prevents recurrent anemia.'
    });
  }

  // Always include a baseline preventative question
  if (questions.length === 0) {
    questions.push({
      topic: 'Preventative Longevity',
      question: 'Since my current markers are within normal limits, what routine screening timeline (e.g., 12 months) do you recommend for my demographic age group?',
      rationale: 'Helps maintain proactive preventative health maintenance.'
    });
  }

  return questions;
}

function generateLifestyleRecommendations(biomarkers, riskScores) {
  const recs = [];

  if (riskScores.cardioScore >= 35) {
    recs.push({
      category: 'Nutrition: Heart & Lipids',
      icon: 'Heart',
      advice: 'Adopt a Mediterranean-style dietary pattern rich in soluble dietary fiber (oats, barley, beans, chia seeds) and monounsaturated fats (extra virgin olive oil, avocados, raw nuts). Limit saturated fats from fatty meats and butter to < 6% of daily calories.'
    });
    recs.push({
      category: 'Physical Activity: Cardiovascular Fitness',
      icon: 'Activity',
      advice: 'Target at least 150 minutes of moderate-intensity aerobic exercise (e.g., brisk walking at 4-5 km/h) or 75 minutes of vigorous cardiovascular activity per week to raise protective HDL cholesterol.'
    });
  }

  if (riskScores.metabolicScore >= 35) {
    recs.push({
      category: 'Nutrition: Glycemic Regulation',
      icon: 'Apple',
      advice: 'Replace refined carbohydrates, white breads, and sugar-sweetened beverages with complex low-glycemic foods. Always pair carbohydrates with lean protein and non-starchy vegetables to flatten glucose post-prandial spikes.'
    });
    recs.push({
      category: 'Metabolic Conditioning',
      icon: 'Dumbbell',
      advice: 'Engage in resistance/strength training 2-3 times weekly. Skeletal muscle is the primary sink for glucose disposal and significantly improves insulin receptor sensitivity.'
    });
  }

  if (riskScores.kidneyScore >= 30) {
    recs.push({
      category: 'Renal Care & Hydration',
      icon: 'Droplet',
      advice: 'Maintain consistent daily hydration (unless on a physician-ordered fluid restriction). Limit dietary sodium to < 2,000 mg/day and avoid chronic, unmonitored use of NSAID painkillers (ibuprofen, naproxen).'
    });
  }

  if (riskScores.liverScore >= 30) {
    recs.push({
      category: 'Hepatic Protection',
      icon: 'Shield',
      advice: 'Strictly avoid or eliminate alcohol consumption. Minimize intake of high-fructose corn syrup and ultra-processed foods. Be cautious with unverified herbal wellness supplements.'
    });
  }

  if (riskScores.anemiaScore >= 30) {
    recs.push({
      category: 'Iron & Oxygenation',
      icon: 'Zap',
      advice: 'Combine iron-rich food sources (spinach, lentils, lean poultry) with Vitamin C (lemon juice, bell peppers, oranges) during the same meal to dramatically amplify iron bioavailability. Avoid drinking tea or coffee within 1 hour of meals, as tannins block iron absorption.'
    });
  }

  if (recs.length === 0) {
    recs.push({
      category: 'Optimal Wellness Maintenance',
      icon: 'Sparkles',
      advice: 'Your biomarkers are balanced! Maintain a colorful whole-food diet, prioritize 7-8 hours of restorative sleep nightly, manage daily stress with mindfulness, and keep active.'
    });
  }

  return recs;
}
