import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRightLeft, LanguagesIcon, Loader2 } from "lucide-react";
import { html } from "pinyin-pro";
import { Listen } from "@/components/Listen.tsx";
import { Speak } from "@/components/Speak.tsx";
import { LANGUAGES, SupportedLanguage } from "@/models/languages.ts";
import { TranslatorType } from "@/models/translator.ts";

import { createTranslator } from "@/services/translation.service.ts";

export function Translator() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState<SupportedLanguage>("de");
  const [targetLang, setTargetLang] = useState<SupportedLanguage>("es");
  const [pinyin, setPinyin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [translator, setTranslator] = useState<TranslatorType | null>(null);

  const handleTranslate = useCallback(
    async ({
      text,
      translatorInput,
    }: {
      text?: string;
      translatorInput?: TranslatorType;
    }) => {
      setIsLoading(true);
      try {
        if (!text && !sourceText) {
          return;
        }

        const translation = await (translatorInput ?? translator)?.translate(
          text ?? sourceText,
        );

        if (targetLang === "zh") {
          const pinyin = html(translation || "Translation failed");
          setPinyin(pinyin);
        }
        setTranslatedText(translation ?? "");
      } catch (error) {
        console.error("Translation failed", error);
        setTranslatedText("Translation failed");
      } finally {
        setIsLoading(false);
      }
    },
    [sourceText, targetLang, translator],
  );

  useEffect(() => {
    createTranslator({
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    }).then(async (translator) => {
      setTranslator(translator);
      await handleTranslate({ translatorInput: translator });
    });
  }, [sourceLang, targetLang]);

  const handleSwapLanguages = useCallback(async () => {
    const newSourceLang = targetLang;
    const newTargetLang = sourceLang;
    setSourceLang(newSourceLang);
    setTargetLang(newTargetLang);

    const translation = await translator?.translate(sourceText);
    setTranslatedText(sourceText || "Translation failed");
    setSourceText(translation || "Translation failed");
  }, [sourceLang, targetLang, sourceText, translator]);

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
                await handleTranslate({ text: sourceText });
              }
            }}
          />
        </div>
        <div className="relative">
          <Label htmlFor="translatedText">Translation</Label>
          {targetLang !== "zh" ? (
            <Textarea
              id="translatedText"
              placeholder="Translation will appear here..."
              value={translatedText}
              readOnly
              className="min-h-[100px]"
            />
          ) : (
            <div className="text-gray-500 rounded-md border border-input bg-transparent min-h-16 px-3 pt-4 pb-3 text-base shadow-sm ">
              <div dangerouslySetInnerHTML={{ __html: pinyin ?? " " }}></div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-3">
        <Button
          className="w-full"
          onClick={() => handleTranslate({ text: sourceText })}
          disabled={isLoading || !sourceText.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <LanguagesIcon className="mr-2 h-4 w-4" />
              <p>Translate</p>
            </>
          )}
        </Button>

        <Speak translatedText={translatedText} targetLang={targetLang} />

        <Listen
          setSourceText={setSourceText}
          language={sourceLang}
          onListen={async (res) => {
            await handleTranslate({ text: res });
          }}
        />
      </CardFooter>
    </Card>
  );
}
