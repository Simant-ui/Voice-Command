export class VoiceService {
  private recognition: any = null;
  private isListeningState = false;
  private currentLanguage: string = 'auto'; // 'auto' | 'ne-NP' | 'en-US'
  private onResultCallback: ((text: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onStateChangeCallback: ((isListening: boolean) => void) | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.initSpeechRecognition();
    this.initSpeechSynthesis();
  }

  private initSpeechSynthesis() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      this.cachedVoices = window.speechSynthesis.getVoices();
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  private initSpeechRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      // Set to ne-NP so speech recognition accurately transcribes Nepali & Nepanglish
      this.recognition.lang = 'ne-NP';

      this.recognition.onstart = () => {
        this.isListeningState = true;
        if (this.onStateChangeCallback) this.onStateChangeCallback(true);
      };

      this.recognition.onend = () => {
        this.isListeningState = false;
        if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      };

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (this.onResultCallback && transcript) {
          this.onResultCallback(transcript);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListeningState = false;
        if (this.onStateChangeCallback) this.onStateChangeCallback(false);
        if (this.onErrorCallback) this.onErrorCallback(event.error || 'Speech recognition failed');
      };
    }
  }

  public setLanguage(lang: 'auto' | 'ne-NP' | 'en-US'): void {
    this.currentLanguage = lang;
    if (this.recognition) {
      if (lang === 'en-US') {
        this.recognition.lang = 'en-US';
      } else {
        // Auto / ne-NP: default to ne-NP for Nepali speech recognition
        this.recognition.lang = 'ne-NP';
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public isListening(): boolean {
    return this.isListeningState;
  }

  public startListening(
    onResult: (text: string) => void,
    onStateChange?: (isListening: boolean) => void,
    onError?: (err: string) => void,
    preferredLang?: 'auto' | 'ne-NP' | 'en-US'
  ): boolean {
    if (!this.recognition) {
      if (onError) onError('Speech recognition is not supported in this environment.');
      return false;
    }

    if (preferredLang) {
      this.setLanguage(preferredLang);
    }

    this.onResultCallback = onResult;
    this.onStateChangeCallback = onStateChange || null;
    this.onErrorCallback = onError || null;

    try {
      this.recognition.start();
      return true;
    } catch (e: any) {
      console.warn('Speech recognition start error:', e);
      if (onError) onError(e.message || 'Already listening');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListeningState) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping speech recognition:', e);
      }
    }
    this.isListeningState = false;
    if (this.onStateChangeCallback) this.onStateChangeCallback(false);
  }

  // Text-to-Speech with Devanagari Nepali & Hindi phonetic routing
  public speak(text: string, onEnd?: () => void, rate = 1.0, preferredVoiceLang?: string): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel(); // Stop current speech

    // Clean markdown symbols from text before speaking
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;

    // Detect if text contains Devanagari characters (Nepali / Nepanglish)
    const containsDevanagari = /[\u0900-\u097F]/.test(cleanText);

    const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();

    if (containsDevanagari || preferredVoiceLang === 'ne-NP' || this.currentLanguage === 'ne-NP' || this.currentLanguage === 'auto') {
      utterance.lang = 'ne-NP';
      // Find Nepali (ne-NP) or Hindi (hi-IN) Devanagari voice
      const nepaliVoice =
        voices.find((v) => v.lang.startsWith('ne') || v.lang.includes('NP')) ||
        voices.find((v) => v.lang.startsWith('hi') || v.lang.includes('IN')) ||
        voices.find((v) => v.lang.includes('Deva'));

      if (nepaliVoice) {
        utterance.voice = nepaliVoice;
      }
    } else {
      utterance.lang = 'en-US';
      const englishVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Zira') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha'))
        ) || voices.find((v) => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const voiceService = new VoiceService();
