# AI Health Interpreter & Predictive Risk Analyzer

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
