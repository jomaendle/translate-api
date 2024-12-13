import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  FlashcardGenerationEvents,
  generateAiFlashcards,
  generatedFlashcardsHistory,
} from "@/services/flashcards.service.ts";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2,
  SparklesIcon,
  TrashIcon,
} from "lucide-react";
import { retryPromise } from "@/utils/retry.ts";
import { html } from "pinyin-pro";
import { useAtom } from "jotai";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { FlashcardSidebar } from "@/components/FlashcardSidebar.tsx";
import {
  sourceLanguageAtom,
  targetLanguageAtom,
} from "@/services/translation.service.ts";

export function Flashcards() {
  const [flashcards, setFlashcards] = useAtom(generatedFlashcardsHistory);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [animation, setAnimation] = useState<
    "flip" | "swipe-left" | "swipe-right" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [isRetrying, setIsRetrying] = useState<number | undefined>();
  const [flashcardCreationProgress, setFlashcardCreationProgress] =
    useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sourceLanguage] = useAtom(sourceLanguageAtom);
  const [targetLanguage] = useAtom(targetLanguageAtom);

  useEffect(() => {
    window.addEventListener(FlashcardGenerationEvents.PROGRESS, () => {
      setFlashcardCreationProgress("Flashcard generation in progress");
    });
    window.addEventListener(FlashcardGenerationEvents.TRANSLATE, () => {
      setFlashcardCreationProgress("Translating flashcards");
    });

    window.addEventListener(FlashcardGenerationEvents.COMPLETE, () => {
      setFlashcardCreationProgress("");
    });
  }, []);

  const addFlashcard = () => {
    if (front.trim() && back.trim()) {
      setFlashcards([
        ...flashcards,
        {
          id: crypto.randomUUID(),
          front,
          back,
          frontLang: sourceLanguage,
          backLang: targetLanguage,
        },
      ]);
      setFront("");
      setBack("");
    }
  };

  const nextCard = () => {
    setAnimation("swipe-left");
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    }, 150);
  };

  const prevCard = () => {
    setAnimation("swipe-right");
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex(
        (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length,
      );
    }, 150);
  };

  const flipCard = () => {
    setAnimation("flip");
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    if (animation) {
      const timer = setTimeout(() => {
        setAnimation(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [animation]);

  const generateFlashcards = () => {
    setIsLoading(true);

    retryPromise(
      () =>
        generateAiFlashcards({
          sourceLang: sourceLanguage,
          targetLang: targetLanguage,
          previouslyGeneratedFlashcards: flashcards,
        }),
      3,
      1000,
      (count) => setIsRetrying(count),
    )
      .then((flashcards) => {
        setFlashcards((prev) => [...prev, ...flashcards]);
        setIsRetrying(undefined);
        console.log(flashcards);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
        setActiveTab("study");
      });
  };

  const clearHistory = () => {
    setFlashcards([]);
  };

  const renderPinyinIfChinese = (targetLang: string, text: string) => {
    if (targetLang === "zh") {
      return (
        <div className="flex items-center justify-center">
          {<div dangerouslySetInnerHTML={{ __html: html(text) }}></div>}
        </div>
      );
    } else {
      return <div className="flex items-center justify-center">{text}</div>;
    }
  };

  const onFlashcardSelect = (id: string) => {
    const index = flashcards.findIndex((card) => card.id === id);
    setCurrentCardIndex(index);
  };

  return (
    <SidebarProvider
      defaultOpen={false}
      open={isSidebarOpen}
      onOpenChange={setIsSidebarOpen}
      className="h-full flex justify-center items-start"
    >
      <FlashcardSidebar
        onSelectCard={onFlashcardSelect}
        onClose={() => setIsSidebarOpen(false)}
      />
      <Card className="w-full max-w-3xl relative mx-auto flex flex-col overflow-clip">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Flashcards
          </CardTitle>

          <div className="flex items-center flex-col sm:flex-row justify-between gap-3">
            <SidebarTrigger className="w-auto px-2 py-4 h-9">
              Toggle Flashcards
            </SidebarTrigger>

            {flashcards.length > 0 && (
              <Button
                onClick={clearHistory}
                variant="ghost"
                className="px-2 py-4"
              >
                <TrashIcon className="h-5 w-5 text-red-500" />
                Clear History
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 h-full flex flex-col ">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
              {isRetrying && (
                <p className="text-sm text-gray-500 ml-2">
                  Retrying... Attempt {isRetrying}
                </p>
              )}

              <p className="text-sm text-gray-500 ml-2">
                {flashcardCreationProgress}
              </p>
            </div>
          )}
          <Tabs
            defaultValue="create"
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col flex-1"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="study">Study</TabsTrigger>
            </TabsList>
            <TabsContent
              value="create"
              className="flex flex-col gap-8 h-full flex-1"
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="front">Front</Label>
                  <Input
                    id="front"
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    placeholder="Enter the question"
                  />
                </div>
                <div>
                  <Label htmlFor="back">Back</Label>
                  <Input
                    id="back"
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    placeholder="Enter the answer"
                  />
                </div>
              </div>
              <CreateActions
                front={front}
                back={back}
                addFlashcard={addFlashcard}
                generateFlashcards={generateFlashcards}
              />
            </TabsContent>
            <TabsContent
              value="study"
              className="flex flex-col items-center h-full justify-center flex-1"
            >
              {flashcards.length > 0 ? (
                <div className="space-y-4 flex flex-col w-full">
                  <div
                    className={`
                    h-48 w-full perspective-1000 cursor-pointer border border-gray-200 rounded-md shadow-md
                    ${animation === "flip" ? "animate-flip" : ""}
                    ${animation === "swipe-left" ? "animate-swipe-left" : ""}
                    ${animation === "swipe-right" ? "animate-swipe-right" : ""}
                  `}
                    onClick={flipCard}
                  >
                    <div
                      className={`
                      relative w-full h-full transition-transform duration-300 transform-style-3d
                      ${isFlipped ? "rotate-y-180" : ""}
                    `}
                    >
                      <Card className="absolute w-full h-full backface-hidden">
                        <CardContent className="flex items-center justify-center h-full">
                          <div className="text-center text-lg">
                            {flashcards &&
                              renderPinyinIfChinese(
                                targetLanguage,
                                flashcards[currentCardIndex].front,
                              )}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="absolute w-full h-full backface-hidden rotate-y-180">
                        <CardContent className="flex items-center justify-center h-full">
                          {flashcards &&
                            renderPinyinIfChinese(
                              sourceLanguage,
                              flashcards[currentCardIndex].back,
                            )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 justify-between">
                    <Button onClick={prevCard} variant="outline">
                      <ChevronLeftIcon className="size-5" />
                      Previous
                    </Button>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <GenerateFlashcardsWithAiButton
                        label={"Generate More"}
                        generateFlashcards={generateFlashcards}
                      />
                      <Button
                        onClick={nextCard}
                        variant="outline"
                        className="w-full"
                      >
                        Next
                        <ChevronRightIcon className="size-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 min-h-44 items-center justify-center">
                  <p className="text-center text-gray-500 text-sm">
                    No flashcards available. Create some first!
                  </p>

                  <GenerateFlashcardsWithAiButton
                    generateFlashcards={generateFlashcards}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-between">
          {activeTab === "study" && (
            <p className="text-sm text-gray-500">
              {activeTab === "study" &&
                flashcards.length > 0 &&
                `${currentCardIndex + 1} of ${flashcards.length}`}
            </p>
          )}
        </CardFooter>
      </Card>
    </SidebarProvider>
  );
}

function GenerateFlashcardsWithAiButton({
  generateFlashcards,
  label,
  disabled,
}: {
  label?: string;
  generateFlashcards: () => void;
  disabled?: boolean;
}) {
  return (
    <Button onClick={generateFlashcards} className="w-full" disabled={disabled}>
      <SparklesIcon className="h-5 w-5 mr-1" />
      {label || "Generate Flashcards with AI"}
    </Button>
  );
}

function CreateActions({
  front,
  back,
  addFlashcard,
  generateFlashcards,
}: {
  front: string;
  back: string;
  addFlashcard: () => void;
  generateFlashcards: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        disabled={!front.trim() || !back.trim()}
        onClick={addFlashcard}
        className="w-full"
      >
        Add Flashcard
      </Button>

      <GenerateFlashcardsWithAiButton generateFlashcards={generateFlashcards} />
    </div>
  );
}
