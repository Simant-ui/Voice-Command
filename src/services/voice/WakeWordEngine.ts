export class WakeWordEngine {
  private recognition: any = null;
  private isListening = false;
  private wakePhrase = 'hey sathi';
  private onWakeCallback: (() => void) | null = null;

  constructor(wakePhrase = 'hey sathi') {
    this.wakePhrase = wakePhrase.toLowerCase();
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.toLowerCase();

          if (
            transcript.includes(this.wakePhrase) ||
            transcript.includes('hey sathi') ||
            transcript.includes('sathi ai') ||
            transcript.includes('sathi') ||
            transcript.includes('sathi suna') ||
            transcript.includes('sathi सुन') ||
            transcript.includes('साथी सुन') ||
            transcript.includes('sathi, सुन')
          ) {
            console.log('[WakeWordEngine] Trigger phrase detected:', transcript);
            if (this.onWakeCallback) {
              this.onWakeCallback();
            }
            break;
          }
        }
      };

      this.recognition.onend = () => {
        // Automatically restart continuous background listening if still enabled
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch {
            // ignore restart collision
          }
        }
      };

      this.recognition.onerror = (err: any) => {
        if (err.error !== 'no-speech' && this.isListening) {
          console.warn('[WakeWordEngine] Recognition error:', err.error);
        }
      };
    }
  }

  public setWakePhrase(phrase: string): void {
    this.wakePhrase = phrase.toLowerCase();
  }

  public start(onWake: () => void): boolean {
    if (!this.recognition) return false;
    this.onWakeCallback = onWake;

    if (this.isListening) {
      return true;
    }

    this.isListening = true;

    try {
      this.recognition.start();
      console.log(`[WakeWordEngine] Continuous background listening active for "${this.wakePhrase}"`);
      return true;
    } catch (e) {
      console.warn('[WakeWordEngine] Already running or error:', e);
      return false;
    }
  }

  public stop(): void {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
  }

  public isActive(): boolean {
    return this.isListening;
  }
}

export const wakeWordEngine = new WakeWordEngine();
