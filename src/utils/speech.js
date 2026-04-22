// Speech synthesis utilities for German pronunciation

export function speakGerman(text, gender = 'male') {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve();
      return;
    }
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.85;
    utterance.pitch = gender === 'female' ? 1.2 : 0.9;
    
    // Try to find a German voice
    const voices = window.speechSynthesis.getVoices();
    const germanVoices = voices.filter(v => v.lang.startsWith('de'));
    
    if (germanVoices.length > 0) {
      if (gender === 'female') {
        const femaleVoice = germanVoices.find(v => 
          v.name.toLowerCase().includes('female') || 
          v.name.toLowerCase().includes('anna') ||
          v.name.toLowerCase().includes('petra') ||
          v.name.toLowerCase().includes('marlene')
        ) || germanVoices[germanVoices.length > 1 ? 1 : 0];
        utterance.voice = femaleVoice;
      } else {
        const maleVoice = germanVoices.find(v => 
          v.name.toLowerCase().includes('male') || 
          v.name.toLowerCase().includes('hans') ||
          v.name.toLowerCase().includes('stefan')
        ) || germanVoices[0];
        utterance.voice = maleVoice;
      }
    }
    
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

export function speakEnglish(text) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve();
      return;
    }
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    if (englishVoices.length > 0) {
      utterance.voice = englishVoices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Premium')) || englishVoices[0];
    }
    
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

// Preload voices
export function loadVoices() {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };
  });
}
