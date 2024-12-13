import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { SpeechIcon } from "lucide-react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

interface ListenProps {
  setSourceText: (text: string) => void;
  language: string;
  onListen: (result: string) => void;
  onLoading?: (isLoading: boolean) => void;
  cancelListen?: () => void;
}

export function Listen({
  setSourceText,
  language,
  onListen,
  onLoading,
  cancelListen,
}: ListenProps) {
  const [recognition, setRecognition] = useState<SpeechRecognition>();
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!language) {
      console.error("Language is not set");
    }
    setRecognition(() => {
      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      return recognition;
    });
  }, [language]);

  useEffect(() => {
    onLoading?.(isListening);
  }, [isListening, onLoading]);

  useEffect(() => {
    if (cancelListen) {
      console.log("Canceling listening...");
      recognition?.abort();
      setIsListening(false);
    }
  }, [cancelListen, recognition]);

  const handleListen = () => {
    if (!recognition) {
      console.error("Recognition is not set");
      return;
    }

    console.log("Listening...", recognition);

    setIsListening(true);
    recognition.start();
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const speechToText = event.results[0][0].transcript;
      setSourceText(speechToText);
      setIsListening(false);
      onListen(speechToText);
    };
  };

  return (
    <Button onClick={handleListen} disabled={isListening} variant="outline">
      <SpeechIcon className="mr-2 h-4 w-4" />
      Speak
    </Button>
  );
}
