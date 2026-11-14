/**
 * Browser Web Speech API Audio Synthesizer
 */

let activeUtterance = null;

export function speakReportSummary(text, langCode = 'en-US', onStart = () => {}, onEnd = () => {}) {
  if (!('speechSynthesis' in window)) {
    alert('Voice narration is not supported in this browser.');
    return;
  }

  stopSpeech();

  // Clean text of markdown characters or special symbols
  const cleanText = text.replace(/[*#_`~>]/g, ' ').replace(/\s+/g, ' ').trim();

  activeUtterance = new SpeechSynthesisUtterance(cleanText);
  activeUtterance.lang = langCode;
  activeUtterance.rate = 0.95; // slightly slower for clinical clarity
  activeUtterance.pitch = 1.0;

  // Try matching available voices for the target language
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(langCode.toLowerCase().slice(0, 2)));
  if (matchedVoice) {
    activeUtterance.voice = matchedVoice;
  }

  activeUtterance.onstart = onStart;
  activeUtterance.onend = () => {
    activeUtterance = null;
    onEnd();
  };
  activeUtterance.onerror = () => {
    activeUtterance = null;
    onEnd();
  };

  window.speechSynthesis.speak(activeUtterance);
}

export function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

export function isSpeaking() {
  return 'speechSynthesis' in window && window.speechSynthesis.speaking;
}
