export const getCountryFlag = (code: string): string => {

  if (!code) return "🌍";

  return code
    .slice(0,-1)
    .toUpperCase()
    .split("")
    .map(char => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
};
