export {};

declare global {
  interface Window {
    ai: {
      languageDetector: {
        capabilities: () => Promise<void>;
      };
      translator: {
        capabilities: () => Promise<void>;
      };
    };
    translation: {
      canTranslate: (options: {
        sourceLanguage: string;
        targetLanguage: string;
      }) => Promise<void>;
      translate: (options: {
        sourceLanguage: string;
        targetLanguage: string;
        text: string;
      }) => Promise<string>;
      downloadprogress: {
        addEventListener: (
          event: string,
          callback: (event: ProgressEvent) => void,
        ) => void;
      };
      createTranslator: (options: {
        sourceLanguage: string;
        targetLanguage: string;
        monitor?: (m: any) => void;
      }) => Promise<{
        translate: (text: string) => Promise<string>;
      }>;
    };
  }
}
