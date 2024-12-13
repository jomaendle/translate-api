import { atomWithStorage } from "jotai/utils";
import { SupportedLanguage } from "@/models/languages.ts";

export const sourceLanguageAtom = atomWithStorage<SupportedLanguage>(
  "sourceLanguage",
  "en",
);
export const targetLanguageAtom = atomWithStorage<SupportedLanguage>(
  "targetLanguage",
  "es",
);

export const isTranslatorApiSupported = () => {
  return "translation" in self && "createTranslator" in self.translation;
};

export async function createTranslator({
  sourceLanguage,
  targetLanguage,
}: {
  sourceLanguage: string;
  targetLanguage: string;
}) {
  if (!isTranslatorApiSupported()) {
    throw new Error("Translation API not supported");
  }

  self.translation
    .canTranslate({
      sourceLanguage,
      targetLanguage,
    })
    .catch(() => {
      throw new Error("At least one language is not supported");
    });

  return self.translation.createTranslator({
    sourceLanguage,
    targetLanguage,
    monitor(m) {
      m.addEventListener("downloadprogress", (e: any) => {
        console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
      });
    },
  });
}
