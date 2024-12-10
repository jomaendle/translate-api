export const isTranslatorApiSupported = () => {
  return "translation" in self && "createTranslator" in self.translation;
};

export async function isLanguagePairSupported(source: string, target: string) {
  if (!isTranslatorApiSupported()) {
    return false;
  }

  const capabilities = await self.ai?.translator?.capabilities();

  if (!capabilities) {
    return false;
  }

  return capabilities.languagePairAvailable(source, target);
}

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
