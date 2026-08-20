export class WakeWordEngine {
  private recognition: any = null;
  private isListening = false;
  private wakePhrase = 'hey sathi';
  private onWakeCallback: (() => void) | null = null;
  private lastTriggerTime = 0;

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
        const now = Date.now();
        // Cooldown of 3 seconds to prevent duplicate rapid triggers
        if (now - this.lastTriggerTime < 3000) return;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const rawTranscript = event.results[i][0].transcript || '';
          const transcript = rawTranscript.toLowerCase().trim();

          console.log('[WakeWordEngine] Background audio transcript:', transcript);

          const isMatch =
            transcript.includes(this.wakePhrase) ||
            transcript.includes('hey sathi') ||
            transcript.includes('hi sathi') ||
            transcript.includes('hey साथी') ||
            transcript.includes('हे साथी') ||
            transcript.includes('साथी') ||
            transcript.includes('sathi ai') ||
            transcript.includes('sathi') ||
            transcript.includes('saathi') ||
            transcript.includes('sathy') ||
            transcript.includes('satty') ||
            transcript.includes('shathi') ||
            transcript.includes('sathi suna') ||
            transcript.includes('sathi सुन') ||
            transcript.includes('साथी सुन');

          if (isMatch) {
            console.log('[WakeWordEngine] SUCCESS! Trigger phrase detected:', transcript);
            this.lastTriggerTime = now;
            if (this.onWakeCallback) {
              this.onWakeCallback();
            }
            break;
          }
        }
      };

      this.recognition.onend = () => {
        // Automatically restart continuous background listening with 200ms delay for browser stability
        if (this.isListening) {
          setTimeout(() => {
            if (this.isListening && this.recognition) {
              try {
                this.recognition.start();
              } catch (e) {
                // ignore restart collision
              }
            }
          }, 200);
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
}

export const wakeWordEngine = new WakeWordEngine();
