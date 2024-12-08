import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { html } from "pinyin-pro";
import { Listen } from "@/components/Listen.tsx";
import { Speak } from "@/components/Speak.tsx";
import { LANGUAGES, SupportedLanguage } from "@/models/languages.ts";
import { TranslatorType } from "@/models/translator.ts";

export function Translator() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState<SupportedLanguage>("de");
  const [targetLang, setTargetLang] = useState<SupportedLanguage>("zh");
  const [pinyin, setPinyin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [translator, setTranslator] = useState<TranslatorType | null>(null);

  useEffect(() => {
    if ("translation" in self && "createTranslator" in self.translation) {
      console.log("Translator API is supported");
      // The Translator API is supported.
      // check if all selected languages are supported
      self.translation
        .canTranslate({
          sourceLanguage: "de",
          targetLanguage: "zh",
        })
        .then(async () => {
          // Both languages are supported
          await createTranslator({});
        })
        .catch(() => {
          // At least one language is not supported
          console.error("At least one language is not supported");
        });
    }
  }, []);

  // download the translations on language change
  useEffect(() => {
    createTranslator({
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    }).then(() => {
      console.log("Translator created with source language", sourceLang);
      handleTranslate();
    });
  }, [sourceLang, targetLang]);

  const handleTranslate = async (text?: string) => {
    setIsLoading(true);
    const translation = await translator?.translate(text ?? sourceText);

    if (targetLang === "zh") {
      const pinyin = html(translation || "Translation failed");
      setPinyin(pinyin);
    } else {
      setPinyin("");
    }
    setTranslatedText(translation || "Translation failed");

    setIsLoading(false);
  };

  const handleSwapLanguages = async () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);

    const translation = await translator?.translate(sourceText);
    setTranslatedText(sourceText || "Translation failed");
    setSourceText(translation || "Translation failed");
  };

  const createTranslator = async ({
    sourceLanguage = "de",
    targetLanguage = "zh",
  }) => {
    console.log("Initializing translator...", self.translation);
    const translator = await self.translation.createTranslator({
      sourceLanguage,
      targetLanguage,
      monitor(m) {
        m.addEventListener("downloadprogress", (e: any) => {
          console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
        });
      },
    });

    setTranslator(translator);

    return translator;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Language Translator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <Label htmlFor="sourceLang">From</Label>
            <Select
              value={sourceLang}
              onValueChange={(v: SupportedLanguage) => setSourceLang(v)}
            >
              <SelectTrigger id="sourceLang">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="mt-auto"
            onClick={handleSwapLanguages}
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <Label htmlFor="targetLang">To</Label>
            <Select
              value={targetLang}
              onValueChange={(v: SupportedLanguage) => setTargetLang(v)}
            >
              <SelectTrigger id="targetLang">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="sourceText">Enter text</Label>
          <Textarea
            id="sourceText"
            placeholder="Type your text here..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="min-h-[100px]"
            onKeyDown={async (e) => {
              if (e.key === "Enter" && e.metaKey) {
                await handleTranslate();
              }
            }}
          />
        </div>
        <div className="relative">
          <Label htmlFor="translatedText">Translation</Label>
          {targetLang !== "zh" && (
            <Textarea
              id="translatedText"
              placeholder="Translation will appear here..."
              value={translatedText}
              readOnly
              className="min-h-[100px]"
            />
          )}

          {targetLang === "zh" && (
            <div className="text-gray-500 rounded-md border border-input bg-transparent min-h-16 px-3 pt-4 pb-3 text-base shadow-sm ">
              <div dangerouslySetInnerHTML={{ __html: pinyin ?? " " }}></div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-3">
        <Button
          className="w-full"
          onClick={() => handleTranslate()}
          disabled={isLoading || !sourceText.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Translating...
            </>
          ) : (
            "Translate"
          )}
        </Button>

        <Speak translatedText={translatedText} targetLang={targetLang} />

        <Listen
          setSourceText={setSourceText}
          language={sourceLang}
          onListen={async (res) => {
            await handleTranslate(res);
          }}
        />
      </CardFooter>
    </Card>
  );
}
