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

export function Flashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const addFlashcard = () => {
    if (front.trim() && back.trim()) {
      setFlashcards([...flashcards, { id: Date.now(), front, back }]);
      setFront("");
      setBack("");
    }
  };

  const nextCard = () => {
    setIsFlipping(true);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    }, 150); // Half of the transition time
  };

  const prevCard = () => {
    setIsFlipping(true);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex(
        (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length,
      );
    }, 150); // Half of the transition time
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    if (isFlipping) {
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 300); // Full transition time
      return () => clearTimeout(timer);
    }
  }, [isFlipping]);

  const generateFlashcards = () => {
    generateAiFlashcards().then((flashcards) => {
      console.log("xx", flashcards);
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Flashcards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create">
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
              <div>
                <Button onClick={addFlashcard} className="w-full">
                  Add Flashcard
                </Button>
                <Button onClick={generateFlashcards}>
                  Generate Flashcards with AI
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="study">
            {flashcards.length > 0 ? (
              <div className="space-y-4">
                <div
                  className={`
                    h-48 w-full perspective-1000 cursor-pointer
                    ${isFlipping ? "animate-flip" : ""}
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
              <p className="text-center">
                No flashcards available. Create some first!
              </p>
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
