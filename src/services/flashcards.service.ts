// create a function which can generate flashcards using the Chrome AI Prompt API
import { Flashcard } from "@/models/flashcards.ts";
import { createTranslator } from "@/services/translation.service.ts";
import { atomWithStorage } from "jotai/utils";

export const FlashcardGenerationEvents = {
  PROGRESS: "flashcard-generation-progress",
  TRANSLATE: "flashcard-translation",
  COMPLETE: "flashcard-generation-finish",
};

export const ProgressFlashcardGenerationEvent = new CustomEvent(
  FlashcardGenerationEvents.PROGRESS,
);

export const TranslationFlashcardGenerationEvent = new CustomEvent(
  FlashcardGenerationEvents.TRANSLATE,
);

export const FinishFlashcardGenerationEvent = new CustomEvent(
  FlashcardGenerationEvents.COMPLETE,
);

export const generatedFlashcardsHistory = atomWithStorage<Flashcard[]>(
  "flashcards",
  [],
);

export function isLanguageModelSupported() {
  return "ai" in self && "languageModel" in self.ai;
}

export async function generateAiFlashcards({
  sourceLang,
  targetLang,
  previouslyGeneratedFlashcards,
}: {
  sourceLang: string;
  targetLang: string;
  previouslyGeneratedFlashcards: Flashcard[];
}): Promise<Flashcard[]> {
  if (!isLanguageModelSupported()) {
    throw new Error("Language model not supported");
  }

  const session = await self.ai.languageModel.create({
    systemPrompt: generatePrompt(targetLang, previouslyGeneratedFlashcards),
  });

  // Clone an existing session for efficiency, instead of recreating one each time.
  async function generateFlashcard(prompt: string): Promise<Flashcard[]> {
    const freshSession = await session.clone();

    window.dispatchEvent(ProgressFlashcardGenerationEvent);

    const res = (await freshSession.prompt(prompt))
      .replace(/```/g, "")
      .replace(/json/g, "");

    const flashcards = JSON.parse(res);

    // check if the response is valid
    if (!Array.isArray(flashcards)) {
      throw new Error("Invalid response");
    }

    return flashcards.map((flashcard: Flashcard) => ({
      id: crypto.randomUUID(),
      front: flashcard.front,
      back: flashcard.back,
      frontLang: targetLang,
      backLang: sourceLang,
    }));
  }

  const baseFlashcards = await generateFlashcard(
    `Give me 5 flashcards in ${targetLang} language.`,
  );

  window.dispatchEvent(TranslationFlashcardGenerationEvent);

  const translator = await createTranslator({
    sourceLanguage: targetLang,
    targetLanguage: sourceLang,
  });

  const result = await Promise.all(
    baseFlashcards.map(async (flashcard) => {
      const translated = await translator.translate(flashcard.front);
      return {
        ...flashcard,
        back: translated,
      };
    }),
  );

  window.dispatchEvent(FinishFlashcardGenerationEvent);

  return result;
}

function generatePrompt(
  targetLang: string,
  previouslyGeneratedFlashcards: Flashcard[],
): string {
  const blacklistWords = previouslyGeneratedFlashcards
    ? previouslyGeneratedFlashcards.map((flashcard) => flashcard.front)
    : [];

  console.log(JSON.stringify(blacklistWords));

  return `I need you to help me generate a series of vocabulary flashcards in ${targetLang}. Each flashcard should be stored as a JSON object and have a "front" with a word or phrase in ${targetLang}, and a "back" which is an empty string. 

  The generated list should include a total of 5 flashcards, with each flashcard being unique and not repeating any words or phrases from the previous ones. I will provide you with a blacklist of words that have already been used in previous batches. Please ensure that none of the words in the list below are repeated in the new batch.

  The blacklist is as follows: 
  \n\n${JSON.stringify(blacklistWords)}

  Your output should only include a list of flashcards in JSON format. Each flashcard should be structured as follows:

  \`\`\`json
  {
    "front": "word in ${targetLang}",
    "back": ""
  }
  \`\`\`

  Please make sure to only output the structured JSON and nothing else. You can proceed to generate the next batch of flashcards without repeating any words from the blacklist. Before returning a response, MAKE SURE to that no words from the blacklist are repeated in the new batch. If you encounter any issues, try again!`;
}
