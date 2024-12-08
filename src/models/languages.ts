export const SUPPORTED_LANGUAGES = ["en", "es", "de", "zh"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGES: {
  code: SupportedLanguage;
  name: string;
}[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
];
