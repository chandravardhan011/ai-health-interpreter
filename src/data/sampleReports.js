// Realistic Medical Reports for instant 1-click loading and analysis
export const SAMPLE_REPORTS = [
  {
    id: 'cardio-risk',
    title: 'Cardiovascular & Lipid Risk Profile',
    patient: { name: 'John Doe', age: 52, gender: 'Male', date: '2026-10-24' },
    summary: 'Elevated total cholesterol, elevated LDL ("bad cholesterol"), low HDL, and high triglycerides indicating significant cardiovascular atherogenic risk.',
    badge: 'High Cardiovascular Risk',
    badgeColor: 'red',
    rawText: `METROPOLITAN CLINICAL LABORATORY
PATIENT: John Doe     AGE: 52     GENDER: MALE
COLLECTION DATE: 24-Oct-2026
TEST PANEL: COMPREHENSIVE LIPID & METABOLIC PANEL

TEST NAME                  OBSERVED VALUE    UNIT        REFERENCE RANGE      STATUS
Total Cholesterol          248               mg/dL       125 - 200            HIGH
Triglycerides              230               mg/dL       < 150                HIGH
HDL Cholesterol            34                mg/dL       40 - 60              LOW
LDL Cholesterol            168               mg/dL       < 100                HIGH
Cholesterol/HDL Ratio      7.29              ratio       < 4.5                HIGH
Fasting Blood Glucose      114               mg/dL       70 - 99              ELEVATED (Impaired)
Hemoglobin A1c             5.9               %           4.0 - 5.6            BORDERLINE HIGH
Serum Creatinine           1.05              mg/dL       0.60 - 1.20          NORMAL
eGFR                       84                mL/min      > 60                 NORMAL
ALT (SGPT)                 42                U/L         7 - 45               NORMAL
AST (SGOT)                 36                U/L         8 - 40               NORMAL
Hemoglobin                 14.8              g/dL        13.5 - 17.5          NORMAL
`
  },
  {
    id: 'diabetes-metabolic',
    title: 'Type-2 Diabetes & Metabolic Syndrome',
    patient: { name: 'Elena Garcia', age: 47, gender: 'Female', date: '2026-11-02' },
    summary: 'Markedly elevated HbA1c (8.4%) and fasting glucose (176 mg/dL) with hypertriglyceridemia, consistent with poorly controlled Type 2 Diabetes.',
    badge: 'Critical Metabolic Alert',
    badgeColor: 'amber',
    rawText: `APEX DIAGNOSTIC HEALTHCARE
PATIENT: Elena Garcia     AGE: 47     GENDER: FEMALE
TEST REPORT: DIABETES CARE & METABOLIC SCREENING
DATE: 02-Nov-2026

TEST DESCRIPTION           RESULT     UNIT        NORMAL INTERVAL       FLAG
Hemoglobin A1c (HbA1c)     8.4        %           4.0 - 5.6             HIGH
Fasting Blood Sugar        176        mg/dL       70 - 99               HIGH
Total Cholesterol          215        mg/dL       120 - 200             HIGH
Triglycerides              265        mg/dL       < 150                 HIGH
HDL Cholesterol            38         mg/dL       45 - 65               LOW
LDL Cholesterol            124        mg/dL       < 100                 BORDERLINE HIGH
Serum Creatinine           1.15       mg/dL       0.55 - 1.02           BORDERLINE HIGH
eGFR                       68         mL/min      > 90                  MILD DECREASE
Blood Urea Nitrogen        22         mg/dL       7 - 20                SLIGHT HIGH
Serum Uric Acid            6.8        mg/dL       2.4 - 6.0             HIGH
Alkaline Phosphatase       95         U/L         44 - 147              NORMAL
ALT (SGPT)                 52         U/L         7 - 35                HIGH
`
  },
  {
    id: 'anemia-microcytic',
    title: 'Severe Microcytic Anemia & Iron Depletion',
    patient: { name: 'Priya Sharma', age: 29, gender: 'Female', date: '2026-11-08' },
    summary: 'Depressed hemoglobin (8.9 g/dL), low MCV (68 fL), and critically depleted ferritin (6 ng/mL) pointing directly to classical Iron Deficiency Anemia.',
    badge: 'Hematologic Deficiency',
    badgeColor: 'purple',
    rawText: `NATIONAL PATHOLOGY INSTITUTE
PATIENT NAME: Priya Sharma    AGE: 29    SEX: FEMALE
COLLECTED: 08-Nov-2026
INVESTIGATION: COMPLETE HEMOGRAM (CBC) & IRON PANEL

INVESTIGATION              VALUE      UNIT        NORMAL RANGE          INTERPRETATION
Hemoglobin (Hb)            8.9        g/dL        12.0 - 15.5           CRITICAL LOW
Red Blood Cell (RBC)       3.35       million/uL  3.8 - 5.2             LOW
White Blood Cell (WBC)     6800       cells/uL    4000 - 11000          NORMAL
Platelet Count             410        k/uL        150 - 450             NORMAL
Mean Corpuscular Vol (MCV) 68.2       fL          80.0 - 100.0          LOW
Serum Ferritin             6.2        ng/mL       15.0 - 150.0          CRITICAL LOW
Vitamin B12                290        pg/mL       200 - 900             NORMAL
Vitamin D (25-OH)          16.4       ng/mL       30 - 80               DEFICIENT
Fasting Glucose            84         mg/dL       70 - 99               NORMAL
Serum Creatinine           0.72       mg/dL       0.5 - 1.1             NORMAL
Total Bilirubin            0.6        mg/dL       0.2 - 1.2             NORMAL
`
  },
  {
    id: 'renal-hepatic-stress',
    title: 'Renal & Hepatic Stress Profile',
    patient: { name: 'Robert Vance', age: 63, gender: 'Male', date: '2026-10-15' },
    summary: 'Elevated creatinine (1.95 mg/dL) with dropped eGFR (38 mL/min) representing moderate CKD, accompanied by elevated ALT and AST liver transaminases.',
    badge: 'Kidney & Liver Warning',
    badgeColor: 'orange',
    rawText: `ST. JUDE HEALTH SYSTEM
PATIENT: Robert Vance     AGE: 63     GENDER: MALE
REPORT: COMPREHENSIVE RENAL & HEPATIC FUNCTION TESTS
DATE: 15-Oct-2026

BIOMARKER                  FINDING    UNIT        STANDARD LIMITS       STATUS
Serum Creatinine           1.95       mg/dL       0.70 - 1.30           HIGH
eGFR                       38         mL/min      > 60                  CRITICAL LOW (Stage 3b CKD)
Blood Urea Nitrogen (BUN)  36         mg/dL       8 - 20                HIGH
Serum Uric Acid            8.9        mg/dL       3.5 - 7.2             HIGH
Serum Albumin              3.2        g/dL        3.5 - 5.0             LOW
ALT (SGPT)                 76         U/L         10 - 40               HIGH
AST (SGOT)                 64         U/L         10 - 40               HIGH
Total Bilirubin            1.8        mg/dL       0.2 - 1.2             HIGH
Alkaline Phosphatase       182        U/L         44 - 147              HIGH
Fasting Glucose            102        mg/dL       70 - 99               BORDERLINE HIGH
Hemoglobin                 11.2       g/dL        13.5 - 17.5           MILD LOW
`
  },
  {
    id: 'optimal-checkup',
    title: 'Annual Preventative Wellness Checkup',
    patient: { name: 'Sarah Miller', age: 34, gender: 'Female', date: '2026-11-10' },
    summary: 'All examined biomarkers are in optimal physiological ranges. Excellent lipid ratios, normal insulin sensitivity, and healthy organ function.',
    badge: 'Optimal Health Profile',
    badgeColor: 'green',
    rawText: `WELLNESS & PREVENTATIVE HEALTH CLINIC
PATIENT: Sarah Miller     AGE: 34     GENDER: FEMALE
DATE: 10-Nov-2026
REPORT: ANNUAL COMPREHENSIVE BIOMARKER SCREEN

PARAMETER                  RESULT     UNIT        REFERENCE RANGE       EVALUATION
Total Cholesterol          164        mg/dL       125 - 200             OPTIMAL
HDL Cholesterol            62         mg/dL       > 50                  EXCELLENT
LDL Cholesterol            82         mg/dL       < 100                 OPTIMAL
Triglycerides              95         mg/dL       < 150                 OPTIMAL
Fasting Blood Sugar        86         mg/dL       70 - 99               OPTIMAL
Hemoglobin A1c             5.1        %           4.0 - 5.6             NORMAL
Serum Creatinine           0.82       mg/dL       0.60 - 1.10           NORMAL
eGFR                       108        mL/min      > 90                  EXCELLENT
ALT (SGPT)                 18         U/L         7 - 35                NORMAL
AST (SGOT)                 21         U/L         8 - 35                NORMAL
Hemoglobin                 13.6       g/dL        12.0 - 15.5           NORMAL
Platelets                  245        k/uL        150 - 450             NORMAL
WBC Count                  6400       cells/uL    4000 - 11000          NORMAL
TSH                        1.85       mIU/L       0.4 - 4.2             OPTIMAL
Vitamin D (25-OH)          48         ng/mL       30 - 80               ADEQUATE
Vitamin B12                540        pg/mL       200 - 900             OPTIMAL
`
  }
];
