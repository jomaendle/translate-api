import styles from "./TranslationApiNotEnabled.module.css";
import { cn } from "@/lib/utils.ts";
import { TriangleAlert } from "lucide-react";
import { isTranslatorApiSupported } from "@/services/translation.service.ts";

export const TranslationApiNotEnabled = () => {
  const isNotSupported = !isTranslatorApiSupported();

  return (
    isNotSupported && (
      <div
        className={cn(
          styles.infoArea,
          "p-4 bg-yellow-100 m-4 rounded-xl flex items-center gap-3",
        )}
      >
        <TriangleAlert className="size-7 text-yellow-800" />
        <div>
          <p className="text-lg font-semibold">Translation API not enabled</p>
          <p className="text-sm">
            In order to use the translator, you need to enable the Translation
            API. Go to{" "}
            <a
              href="chrome://flags/#translation-api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              chrome://flags/#translation-api
            </a>{" "}
            and enable the Translation API.
          </p>
        </div>
      </div>
    )
  );
};
