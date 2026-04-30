export const CURRENCY_FLAGS: Record<string, string> = {
  USD: "🇺🇸",
  IDR: "🇮🇩",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  SGD: "🇸🇬",
  CNY: "🇨🇳",
  BTC: "₿",
};

export function getCurrencyFlag(currency: string): string {
  return CURRENCY_FLAGS[currency.toUpperCase()] || "🏳️";
}
