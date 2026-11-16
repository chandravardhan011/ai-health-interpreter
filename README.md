# AI Health Report Interpreter

An intelligent, multilingual medical lab report interpreter and disease risk prediction platform. Transforms complex clinical laboratory reports (CBC, Lipid Panel, Metabolic Profiles, Liver & Kidney Function) into clear, patient-friendly explanations, multi-disease risk stratification scores, and customized doctor consultation checklists in 10 languages.

---

## 🌟 Key Features

1. **Intelligent Report Parsing & Biomarker Extraction**:
   - Parses unstructured lab reports from file uploads (`.txt`, `.csv`, `.pdf` extracts, `.json`) or direct text pasting.
   - Extracts observed numbers, units, reference intervals, and patient demographics.
   - Maps values against clinical reference intervals (Normal, Borderline, High, Low, Critical High, Critical Low).

2. **Multi-Disease Predictive Risk Stratification**:
   - **Cardiovascular Atherogenic Risk (0–100%)**: Evaluates Total Cholesterol, LDL, HDL, Triglycerides, and cardiac ratios.
   - **Type-2 Diabetes & Metabolic Syndrome Risk (0–100%)**: Evaluates Fasting Glucose and Glycated Hemoglobin (HbA1c).
   - **Kidney (Renal) Filtration Risk (0–100%)**: Assesses eGFR filtration rate stages and Serum Creatinine.
   - **Liver (Hepatic) Function Risk (0–100%)**: Analyzes ALT (SGPT), AST (SGOT), Bilirubin, and Alkaline Phosphatase.
   - **Hematology & Anemia Risk (0–100%)**: Evaluates Hemoglobin, MCV, Ferritin, and Platelet status.
   - **Overall Health Index (0–100)**: Composite health score with urgency level indicator.

3. **Multilingual Translation & Accessibility**:
   - Instant translation across **10 languages**:
     - English (US) 🇺🇸
     - Spanish (Español) 🇪🇸
     - Hindi (हिन्दी) 🇮🇳
     - French (Français) 🇫🇷
     - German (Deutsch) 🇩🇪
     - Mandarin Chinese (中文) 🇨🇳
     - Arabic (العربية) 🇸🇦
     - Bengali (বাংলা) 🇧🇩
     - Portuguese (Português) 🇧🇷
     - Russian (Русский) 🇷🇺
   - **Text-to-Speech (TTS) Voice Narration**: Reads findings aloud using Web Speech API in the user's selected language.

4. **Doctor-Ready Questions & Lifestyle Guidance**:
   - Generates personalized, clinically grounded questions for the patient's next appointment.
   - One-click copy to clipboard for phone notes.
   - Target nutrition and exercise guidance tailored to abnormal biomarkers.

5. **Interactive AI Health Assistant**:
   - Interactive Q&A chat assistant for questions like *"What does high LDL mean for me?"* or *"What food should I eat?"*
   - Includes optional Google Gemini API key integration for custom LLM responses.

6. **5 Built-In Realistic Clinical Test Cases**:
   - Cardiovascular & Lipid Risk Profile
   - Type-2 Diabetes & Metabolic Syndrome
   - Severe Microcytic Anemia & Iron Depletion
   - Renal & Hepatic Stress Profile
   - Annual Preventative Wellness Checkup

---

## 🏗️ System Architecture & Working Model

A focused stack connects extraction, OCR, and rule-based clinical analysis. Each layer has a defined role, from the interface to the clinical knowledge base:

```
[ Patient / Lab Report PDF / Scanned Document ]
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Frontend Layer                                           │
│    • React.js, Vite, HTML, CSS, JavaScript                  │
│    • Drag-and-drop report uploader, visual range gauges     │
│    • Regional audio player & multilingual support           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. PDF & OCR Ingestion Pipeline                             │
│    • PyMuPDF, Tesseract, pytesseract & Pillow               │
│    • Client-side Mozilla PDF.js stream extraction           │
│    • Layout coordinate grouping & tabular row reconstruction│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Clinical Analysis & Knowledge Engine                     │
│    • Python & JS rule-based processing                      │
│    • Structured JSON knowledge base (30+ biomarkers)        │
│    • Reference interval normalization & status evaluation   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Output & Presentation Layer                              │
│    • Executive Health Summary & Key Findings                │
│    • 4-Pillar Health Stratification (Cardio, Diabetes,      │
│      Anemia, Overall Wellness Score)                        │
│    • Tailored Doctor Questions & Lifestyle Guidance         │
└─────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities:
1. **Frontend (Interactive Client Layer)**:
   - **Technologies**: React.js, Vite, HTML, CSS, JavaScript.
   - **Role**: Provides the patient portal, drag-and-drop file upload, visual range gauges, and regional audio player.
2. **Backend (Server & API Processing)**:
   - **Technologies**: Python and Flask.
   - **Role**: Handles server-side parsing endpoints, microservice routing, and asynchronous report batch operations.
3. **PDF and OCR (Document Ingestion Pipeline)**:
   - **Technologies**: PyMuPDF, Tesseract, pytesseract, Pillow, and client-side PDF.js.
   - **Role**: Extracts text streams and spatial coordinates from digital PDFs and runs optical character recognition on scanned pages.
4. **Analysis (Knowledge & Rule Engine)**:
   - **Technologies**: Python and rule-based processing with a JSON knowledge base.
   - **Role**: Evaluates observed numbers against reference intervals, detects status (Normal, Low, High), and formulates tailored doctor questions.

---

## 🚀 How to Run

### Prerequisites
- Node.js (v18+ or v26+) and npm installed.

### Quick Start
```bash
# 1. Navigate to the project directory
cd C:\Users\DELL\.gemini\antigravity\scratch\ai-health-interpreter

# 2. Start the development server
npm run dev

# Or build and preview production bundle:
npm run build
npm run preview
```

Open `http://localhost:3000` (or the port displayed in your terminal) in your browser.

---

## 📂 Project Structure

```
ai-health-interpreter/
├── index.html                  # HTML entry point with Tailwind CDN & typography
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite configuration
├── test-reports/               # Realistic sample lab report text files
│   ├── cardio-risk-report.txt
│   ├── diabetes-report.txt
│   └── anemia-report.txt
├── src/
│   ├── main.jsx                # React root mount
│   ├── App.jsx                 # Main application state and layout
│   ├── data/
│   │   ├── biomarkers.js       # 30+ Biomarker database, ranges & clinical tips
│   │   ├── sampleReports.js    # Preloaded authentic clinical cases
│   │   └── translations.js     # 10-language localization dictionary
│   ├── utils/
│   │   ├── reportParser.js     # Biomarker matching & regex extractor
│   │   ├── riskEngine.js       # Multi-disease risk calculator & synthesis
│   │   └── speech.js           # Web Speech API audio narration
│   └── components/
│       ├── Header.jsx          # Navbar, language switcher, audio & export
│       ├── FileUpload.jsx      # Drag-and-drop, text paste & sample picker
│       ├── RiskOverview.jsx    # Health index dial & 5 disease risk bars
│       ├── BiomarkerTable.jsx  # Table, filter tabs, visual range meters
│       ├── DoctorQuestions.jsx # Tailored questions to ask physician
│       ├── LifestyleAdvice.jsx # Evidence-based diet & activity tips
│       ├── AIAssistantChat.jsx # Interactive medical Q&A with Gemini support
│       └── MedicalDisclaimer.jsx # Required clinical safety banner
```

---

## ⚖️ Safety & Clinical Disclaimer
This system is an assistive educational tool designed to promote patient health literacy and facilitate doctor-patient communication. It is not an automated medical diagnostic tool and does not provide prescriptions or treatment plans. Patients must always review findings with a licensed healthcare practitioner.
