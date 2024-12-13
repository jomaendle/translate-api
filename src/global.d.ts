export {};

declare global {
  interface Window {
    ai: {
      languageDetector: {
        capabilities: () => Promise<void>;
      };
      translator: {
        capabilities: () => Promise<{
          languagePairAvailable: (source: string, target: string) => boolean;
        }>;
      };
      languageModel: {
        create: ({
          initialPrompts,
          systemPrompt,
        }: {
          initialPrompts?: {
            role: string;
            content: string;
          }[];
          systemPrompt?: string;
        }) => {
          prompt: (text: string) => Promise<string>;
          clone: () => Promise<
            ReturnType<typeof window.ai.languageModel.create>
          >;
        };
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
      capabilities: () => Promise<void>;
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
