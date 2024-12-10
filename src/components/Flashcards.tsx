import { useState, useEffect } from "react";
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
import { Flashcard } from "@/models/flashcards.ts";
import { generateAiFlashcards } from "@/services/flashcards.service.ts";
import { Loader2, SparklesIcon } from "lucide-react";

export function Flashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [animation, setAnimation] = useState<
    "flip" | "swipe-left" | "swipe-right" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("create");

  const addFlashcard = () => {
    if (front.trim() && back.trim()) {
      setFlashcards([...flashcards, { id: crypto.randomUUID(), front, back }]);
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
    generateAiFlashcards()
      .then((flashcards) => {
        setFlashcards(flashcards);
      })
      .finally(() => {
        setIsLoading(false);
        setActiveTab("study");
      });
  };

  return (
    <Card className="w-full min-h-[480px] max-w-3xl mx-auto flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Flashcards
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 h-full flex flex-col relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
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
          <TabsContent value="create">
            <div className="space-y-4">
              <div>
                <Label htmlFor="front">Front</Label>
                <Input
                  id="front"
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  placeholder="Enter the question or prompt"
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
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  disabled={!front.trim() || !back.trim()}
                  onClick={addFlashcard}
                  className="w-full"
                >
                  Add Flashcard
                </Button>

                <Button onClick={generateFlashcards} className="w-full">
                  <SparklesIcon className="h-5 w-5 mr-1" />
                  Generate Flashcards with AI
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="study"
            className="flex flex-col items-center h-full justify-center flex-1"
          >
            {flashcards.length > 0 ? (
              <div className="space-y-4 flex flex-col w-full">
                <div
                  className={`
                    h-48 w-full perspective-1000 cursor-pointer
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
                        <p className="text-center text-lg">
                          {flashcards[currentCardIndex].front}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="absolute w-full h-full backface-hidden rotate-y-180">
                      <CardContent className="flex items-center justify-center h-full">
                        <p className="text-center text-lg">
                          {flashcards[currentCardIndex].back}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button onClick={prevCard} variant="outline">
                    Previous
                  </Button>
                  <Button onClick={nextCard} variant="outline">
                    Next
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-center text-gray-500 text-sm">
                  No flashcards available. Create some first!
                </p>

                <Button onClick={generateFlashcards} className="w-full">
                  <SparklesIcon className="h-5 w-5 mr-1" />
                  Generate Flashcards with AI
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">
          Total flashcards: {flashcards.length}
        </p>
      </CardFooter>
    </Card>
  );
}
