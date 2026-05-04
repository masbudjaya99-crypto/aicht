export const supportedLocales = ["en", "id", "ms", "ar", "hi", "pt", "es", "fr", "de", "tr", "th", "vi", "zh"];

export function detectLocale(language?: string) {
  const normalized = (language || "en").toLowerCase().split("-")[0];
  return supportedLocales.includes(normalized) ? normalized : "en";
}
