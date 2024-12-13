import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { LANGUAGES, SupportedLanguage } from "@/models/languages.ts";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

const LanguageSelectDropdown = ({
  language,
  setLanguage,
  id,
  label,
}: {
  id: string;
  label: string;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
}) => {
  return (
    <div className="flex-1">
      <Label htmlFor="sourceLang">{label}</Label>
      <Select
        value={language}
        onValueChange={(v: SupportedLanguage) => setLanguage(v)}
      >
        <SelectTrigger id={id}>
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
  );
};

const LanguageSelection = ({
  sourceLang,
  targetLang,
  setSourceLang,
  setTargetLang,
  handleSwapLanguages,
}: {
  sourceLang: SupportedLanguage;
  targetLang: SupportedLanguage;
  setSourceLang: (lang: SupportedLanguage) => void;
  setTargetLang: (lang: SupportedLanguage) => void;
  handleSwapLanguages: () => void;
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <LanguageSelectDropdown
        language={sourceLang}
        setLanguage={setSourceLang}
        id="sourceLang"
        label="From"
      />
      <Button
        variant="outline"
        size="icon"
        className="mt-auto"
        onClick={handleSwapLanguages}
      >
        <ArrowRightLeft className="h-4 w-4" />
      </Button>
      <LanguageSelectDropdown
        language={targetLang}
        setLanguage={setTargetLang}
        id="targetLang"
        label="To"
      />
    </div>
  );
};

export { LanguageSelectDropdown, LanguageSelection };
