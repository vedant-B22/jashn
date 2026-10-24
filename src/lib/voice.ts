/**
 * Web Speech API wrapper with feature-detection and fallback.
 */

// Define SpeechRecognition interface for browser compatibility
interface SpeechRecognitionEventLike {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export function createSpeechRecognizer(
  onTranscript: (text: string) => void,
  onError: (err: string) => void,
  onEnd: () => void,
  locale = 'en-IN',
): { start: () => void; stop: () => void } | null {
  if (!isSpeechRecognitionSupported()) return null;

  const SpeechConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechConstructor) return null;

  try {
    const recognizer = new SpeechConstructor();
    recognizer.continuous = false;
    recognizer.interimResults = false;
    recognizer.lang = locale;

    recognizer.onresult = (event: SpeechRecognitionEventLike) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        onTranscript(transcript);
      }
    };

    recognizer.onerror = (e) => {
      onError(typeof e === 'object' && e !== null ? 'Speech recognition error' : String(e));
    };

    recognizer.onend = () => {
      onEnd();
    };

    return {
      start: () => {
        try {
          recognizer.start();
        } catch {
          // Already active or denied
        }
      },
      stop: () => {
        try {
          recognizer.stop();
        } catch {
          // Ignore
        }
      },
    };
  } catch {
    return null;
  }
}
