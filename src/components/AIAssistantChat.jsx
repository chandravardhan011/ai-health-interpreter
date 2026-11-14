import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, Key, HelpCircle } from 'lucide-react';

export function AIAssistantChat({ biomarkers, patient, risks, t }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello ${patient.name !== 'Patient' ? patient.name : 'there'}! I am your AI Health Assistant. I have analyzed your lab results and disease risk factors. You can ask me any question about your numbers, what they mean, or dietary and lifestyle adjustments.`
    }
  ]);
  const [input, setInput] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [loading, setLoading] = useState(false);

  // Quick prompt suggestions
  const suggestedPrompts = [
    'What is the most concerning finding in my report?',
    'What foods should I eat to improve my results?',
    'Explain the difference between HDL and LDL cholesterol',
    'How often should I repeat this blood test?'
  ];

  const handleSend = async (questionText) => {
    const q = questionText || input;
    if (!q.trim()) return;

    const userMessage = { role: 'user', text: q };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      if (geminiApiKey) {
        // Use Gemini API directly if key is provided
        const answer = await queryGeminiAPI(q, geminiApiKey, biomarkers, patient, risks);
        setMessages(prev => [...prev, { role: 'assistant', text: answer }]);
      } else {
        // Built-in intelligent clinical knowledge generator
        const simulatedAnswer = generateSmartClinicalAnswer(q, biomarkers, patient, risks);
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'assistant', text: simulatedAnswer }]);
          setLoading(false);
        }, 500);
        return;
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `Error connecting to Gemini API: ${err.message}. Showing built-in clinical analysis instead:\n\n${generateSmartClinicalAnswer(q, biomarkers, patient, risks)}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 no-print">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Bot className="w-5 h-5 text-clinical-600" />
            <span>{t.aiChatTitle}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.aiChatDesc}
          </p>
        </div>

        {/* Gemini API Key Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
          >
            <Key className="w-3.5 h-3.5 text-slate-500" />
            <span>{geminiApiKey ? 'Gemini Key Configured ✓' : 'Custom Gemini API Key (Optional)'}</span>
          </button>
        </div>
      </div>

      {/* Optional Gemini Key Input Box */}
      {showKeyInput && (
        <div className="p-4 bg-clinical-50/50 border-b border-clinical-100 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="password"
            placeholder="Enter your Google Gemini API Key (e.g. AIzaSy...)"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
          />
          <button
            onClick={() => setShowKeyInput(false)}
            className="px-4 py-2 bg-clinical-600 text-white rounded-lg text-xs font-semibold shrink-0 hover:bg-clinical-700"
          >
            Save Key
          </button>
        </div>
      )}

      {/* Chat Messages */}
      <div className="p-5 max-h-80 overflow-y-auto space-y-4 bg-slate-50/30">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-clinical-600 text-white flex items-center justify-center shrink-0 text-xs shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-3.5 rounded-2xl max-w-xl text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-clinical-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
              }`}
            >
              {m.text}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 text-xs shadow-sm">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 italic">
            <Bot className="w-4 h-4 text-clinical-600 animate-spin" />
            <span>Analyzing clinical context and formulating guidance...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2">
        {suggestedPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="text-[11px] font-medium bg-white hover:bg-clinical-50 hover:text-clinical-700 text-slate-600 px-3 py-1 rounded-full border border-slate-200 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-slate-200 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question about your biomarkers or risks..."
          className="flex-1 text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-clinical-500 bg-slate-50/50"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="p-3 rounded-xl bg-clinical-600 hover:bg-clinical-700 text-white disabled:opacity-50 transition-all shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}

// Built-in intelligent clinical responder
function generateSmartClinicalAnswer(question, biomarkers, patient, risks) {
  const q = question.toLowerCase();
  const abnormals = biomarkers.filter(b => b.status !== 'NORMAL');

  if (q.includes('concerning') || q.includes('worst') || q.includes('important')) {
    if (abnormals.length === 0) {
      return "All of your detected biomarkers are within normal reference limits. Your results do not exhibit acute or concerning red flags!";
    }
    const criticals = abnormals.filter(b => b.status === 'CRITICAL_HIGH' || b.status === 'CRITICAL_LOW');
    if (criticals.length > 0) {
      const top = criticals[0];
      return `The most notable parameter is **${top.name}** at ${top.value} ${top.unit} (${top.status.replace('_', ' ')}). ${top.clinicalNote} You should bring this to your physician's attention promptly.`;
    }
    const top = abnormals[0];
    return `The parameter with the greatest deviation is **${top.name}** (${top.value} ${top.unit}). ${top.clinicalNote}`;
  }

  if (q.includes('food') || q.includes('eat') || q.includes('diet') || q.includes('nutrition')) {
    if (risks.cardio?.score >= 40) {
      return "For cardiovascular health: Prioritize soluble fiber (rolled oats, beans, chia seeds) and heart-healthy monounsaturated fats (extra virgin olive oil, walnuts). Avoid fried foods, processed meats, and tropical oils high in saturated fats.";
    }
    if (risks.metabolic?.score >= 40) {
      return "For glycemic management: Minimize refined starches, white bread, and sugary beverages. Choose low-glycemic complex carbohydrates (quinoa, berries, lentils) and always pair carbs with healthy protein and non-starchy greens.";
    }
    if (risks.anemia?.score >= 40) {
      return "For iron enhancement: Incorporate iron-rich foods (spinach, lentils, dark leafy vegetables) paired with Vitamin C (citrus, bell peppers) to boost absorption. Avoid tea/coffee during meal times.";
    }
    return "A balanced Mediterranean diet rich in colorful vegetables, legumes, whole grains, and lean proteins is ideal to maintain your excellent biomarker profile!";
  }

  if (q.includes('hdl') && q.includes('ldl')) {
    return "LDL is termed 'bad' cholesterol because it transports cholesterol directly into your artery walls, contributing to plaque buildup. HDL is 'good' cholesterol because it acts as a molecular scavenger, clearing excess cholesterol from arteries and carrying it back to the liver for safe disposal.";
  }

  if (q.includes('repeat') || q.includes('often') || q.includes('timeline')) {
    if (abnormals.length > 0) {
      return "Given the variances in your report, doctors commonly recommend repeating targeted blood tests in 6 to 12 weeks to monitor the effectiveness of any diet, lifestyle, or medical interventions.";
    }
    return "For normal baseline checkups, an annual wellness screen (every 12 months) is the standard clinical guideline.";
  }

  return `Based on your profile (${patient.name || 'Patient'}, ${patient.age || 45}y), your report shows ${abnormals.length} marker(s) outside normal limits. We always advise discussing your specific trends with your physician alongside your medical history and clinical exam.`;
}

// Live Gemini API client
async function queryGeminiAPI(question, apiKey, biomarkers, patient, risks) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const prompt = `You are an AI Health Interpreter. A patient asks: "${question}".
Patient: ${patient.name}, ${patient.age} years old, ${patient.gender}.
Report Biomarkers: ${JSON.stringify(biomarkers.map(b => ({ name: b.name, value: b.value, unit: b.unit, status: b.status })))}
Disease Risk Scores: ${JSON.stringify(risks)}

Provide a warm, reassuring, medically accurate, and easy-to-understand explanation in 2-3 short paragraphs. Include a reminder to consult their healthcare provider.`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error?.message || 'Gemini API call failed');
  }

  const data = await res.json();
  return data.candidates[0]?.content?.parts[0]?.text || 'No response generated.';
}
