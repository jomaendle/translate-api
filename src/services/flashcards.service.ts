// create a function which can generate flashcards using the Chrome AI Prompt API

export async function generateAiFlashcards() {
  const session = await self.ai.languageModel.create({
    systemPrompt:
      "Generate 5 flashcards. each with a front and back. The front should be a question and the back should be the answer. Output the flashcards as a JSON array.",
    initialPrompts: [],
  });

  // Clone an existing session for efficiency, instead of recreating one each time.
  async function generateFlashcard(prompt: string): Promise<any> {
    const freshSession = await session.clone();
    return await freshSession.prompt(prompt);
    /*const flashcards = JSON.parse(res);*/

    /*  // check if the response is valid
    if (!Array.isArray(flashcards)) {
      throw new Error("Invalid response");
    }

    return flashcards;*/
  }

  return await generateFlashcard(
    "Give me 5 flashcards about basic words in Chinese",
  );
}
