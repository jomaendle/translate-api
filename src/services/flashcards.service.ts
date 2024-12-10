// create a function which can generate flashcards using the Chrome AI Prompt API
import { Flashcard } from "@/models/flashcards.ts";

export function isLanguageModelSupported() {
  return "ai" in self && "languageModel" in self.ai;
}

export async function generateAiFlashcards(): Promise<Flashcard[]> {
  if (!isLanguageModelSupported()) {
    throw new Error("Language model not supported");
  }

  const session = await self.ai.languageModel.create({
    systemPrompt:
      "Generate 5 flashcards. each with a front and back. The front should be a question and the back should be the answer. Output the flashcards as a JSON array.",
    initialPrompts: [
      {
        role: "user",
        content:
          "Generate 5 flashcards. each with a front and back. The front should be a question and the back should be the answer. Output the flashcards as a JSON array.",
      },
      { role: "assistant", content: "{front: '你好 (nǐ hǎo)', back: 'Hello'}" },
      {
        role: "assistant",
        content:
          "{front: '你叫什么名字？ (nǐ jiào shénme míngzì?)', back: 'What is your name?'}",
      },
      {
        role: "assistant",
        content:
          "{front: '你是哪国人？ (nǐ shì nǎ guó rén?)', back: 'What country are you from?'}",
      },
    ],
  });

  // Clone an existing session for efficiency, instead of recreating one each time.
  async function generateFlashcard(prompt: string): Promise<Flashcard[]> {
    const freshSession = await session.clone();
    const res = (await freshSession.prompt(prompt))
      .replace(/```/g, "")
      .replace(/json/g, "");

    console.log(res);

    const flashcards = JSON.parse(res);

    // check if the response is valid
    if (!Array.isArray(flashcards)) {
      throw new Error("Invalid response");
    }

    return flashcards.map((flashcard: Flashcard) => ({
      id: crypto.randomUUID(),
      front: flashcard.front,
      back: flashcard.back,
    }));
  }

  return await generateFlashcard(
    "Give me 5 flashcards about basic words in Chinese",
  );
}
