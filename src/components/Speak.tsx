import { Button } from "./ui/button";
import { Volume2 } from "lucide-react";

interface SpeakProps {
  translatedText: string;
  targetLang: string;
}

export function Speak({ translatedText, targetLang }: SpeakProps) {
  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = targetLang;
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  return (
    <Button onClick={handleSpeak} disabled={!translatedText} variant="outline">
      <Volume2 className="mr-2 h-4 w-4" />
      Listen
    </Button>
  );
}
