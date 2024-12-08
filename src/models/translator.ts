export interface TranslatorType {
  translate: (text: string) => Promise<string>;
}
